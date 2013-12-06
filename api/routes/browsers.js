var _ = require('lodash'),
    error = require('../error'),
    Q = require('q'),
    userUpdate = require('../../app/controllers/user_update');

var User = require('../../models/user'),
    Item = require('../../models/item');

// used after hasValidAccessToken
var loadUser = function (req, res, next) {
    var userId = req.accessToken.user;
    User.byId(userId)
        .then(function (user) {
            if (!user) return error.sendError(res, new error.ServerError('No user')); //if we do not delete user by hands this should not happen
            req.user = user;
            next();
        })
        .fail(error.sendIfFailed(res));
};

var checkBrowserKey = function (req, res, next) {
    var browserKey = (req.params.browserKey || '').trim();
    if (browserKey.length > 0) {
        req.browserKey = browserKey;
        req.listboard = _.find(req.user.listboards, { browserKey: browserKey });

        next();
    } else {
        error.sendError(res, new error.InvalidRequest('Bad browserKey'));
    }
};

function makeCache(arr, field) {
    var cache = {};
    arr.forEach(function(el) {
        cache[el[field]] = el;
    })
    return cache;
}

module.exports = function (app) {
    app.post('/browsers/:browserKey', loadUser, checkBrowserKey, function (req, res) {
        var body = req.body;
        var listboard = req.listboard || req.user.addListboard({
            type: 0, label: 'My ' + body.browserName + ' browser', browserKey: req.browserKey
        });
        listboard.lastSyncDate = new Date();

        var listboardId = listboard._id, user = req.user, userId = user._id;



        var containerExternalIdCache = makeCache(listboard.containers, 'externalId');
        var windowExternalIdCache = {};
        var promises = [];

        // to send comet update
        var createdContainers = [];
        var updatedContainers = [];
        var deletedContainers = [];
        var createdItems = [];
        var updatedItems = [];

        // first we save a new listboard/container structure
        // windows <-> containers
        // create containers that does not exists
        body.windows.forEach(function (window) {
            //each window mapped to container
            var container = containerExternalIdCache[window.externalId];
            if (!container) {
                listboard.addContainer({
                    type: 0,
                    externalId: window.externalId
                });
                container = listboard.last();
                containerExternalIdCache[window.externalId] = container;
                createdContainers.push(container);
            }

            windowExternalIdCache[window.externalId] = window;
        });

        // remove containers that already was closed as tabs
        _.each(containerExternalIdCache, function (container, externalId) {
            if (!windowExternalIdCache[externalId]) {
                deletedContainers.push(container);
                listboard.removeContainer(container);
            }
        });

        // second we sync new structure with items/urls
        listboard.containers.forEach(function(container) {
            var window = windowExternalIdCache[container.externalId];

            if(container.items.length > 0) {
                // container is not empty - assume it is updated

                var tabExternalIdCache = makeCache(window.tabs, 'externalId');
                promises.push(Item.all({ _id: { $in : container.items } }).then(function(items) {
                    var itemsCache = makeCache(items, 'externalId');

                    var itemPromises = [];

                    _.each(tabExternalIdCache, function(tab, externalId) {
                        var item = itemsCache[externalId];
                        if(item) { //item with this external id found
                            if(item.url != tab.url) {
                                item.title = tab.title;
                                item.url = tab.url;
                                item.favicon = 'http://www.google.com/s2/favicons?domain=' + encodeURIComponent(item.url);
                                updatedItems.push(item);
                                itemPromises.push(item.saveWithPromise());
                            }
                            delete itemsCache[externalId];
                        } else {
                            var item = new Item({
                                externalId: tab.externalId,
                                title: tab.title,
                                url: tab.url,
                                favicon: 'http://www.google.com/s2/favicons?domain=' + encodeURIComponent(tab.url),
                                type: 0,
                                user: user._id
                            });

                            createdItems.push(item);
                            container.items.push(item._id);

                            itemPromises.push(item.saveWithPromise());
                        }
                    });

                    _.each(itemsCache, function(item) {
                        container.items.remove(item._id);
                    });

                    return Q.all(itemPromises);
                }).done());
                updatedContainers.push(container);
            } else {
                // container is empty
                window.tabs.map(function (tab) {
                    var item = new Item({
                        externalId: tab.externalId,
                        title: tab.title,
                        url: tab.url,
                        //TODO: we need to download favicon and no use external URL
                        favicon: 'http://www.google.com/s2/favicons?domain=' + encodeURIComponent(tab.url),
                        type: 0,
                        user: user._id
                    });

                    createdItems.push(item);

                    container.items.push(item._id);
                    promises.push(item.saveWithPromise());
                });
            }
        });

        promises.push(req.user.saveWithPromise());

        return Q.all(promises)
            .fail(error.sendIfFailed(res))//by default it send 500
            .then(function () {
                res.send('Ok');//TODO i think need to send something else?
            })
            .then(function() {
                if(!req.listboard) userUpdate.createListboard(userId, listboard);
            })
            .then(userUpdate.bulkCreateContainer.bind(null, userId, listboardId, createdContainers))
            .then(userUpdate.bulkUpdateContainer.bind(null, userId, listboardId, updatedContainers))
            .then(userUpdate.bulkDeleteContainer.bind(null, userId, listboardId, deletedContainers))
            .then(userUpdate.bulkCreateItem.bind(null, userId, createdItems))
            // some have the url updated others are not deleted, but marked as deleted //TODO: should we delete them
            .then(userUpdate.bulkUpdateItem.bind(null, userId, updatedItems));
    })

}
