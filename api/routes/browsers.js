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

module.exports = function (app) {
    app.post('/browsers/:browserKey', loadUser, checkBrowserKey, function (req, res) {
        var body = req.body;

        var listboard = req.listboard || req.user.addListboard({
            type: 0, label: 'My ' + body.browserName + ' browser', browserKey: req.browserKey
        });

        var listboardId = listboard._id;

        var user = req.user, userId = user._id;

        listboard.lastSyncDate = new Date();

        var containerExternalIdCache = {};

        listboard.containers.forEach(function (container) {
            containerExternalIdCache[container.externalId] = container;
        });

        var windowExternalIdCache = {};

        var createdContainers = [];

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

        var deletedContainers = [];

        // remove containers that already was closed as tabs
        _.each(containerExternalIdCache, function (container, externalId) {
            if (!windowExternalIdCache[externalId]) {
                deletedContainers.push(container);
                listboard.removeContainer(container);
            }
        });

        var createdItems = [];
        var updatedItems = [];

        req.user.saveWithPromise() //save structure
            .then(function () {
                return Q.all(listboard.containers.map(function (container) {
                    // load all items from this container
                    var window = windowExternalIdCache[container.externalId];
                    var tabExternalIdCache = {};

                    window.tabs.forEach(function (tab) {
                        tabExternalIdCache[tab.externalId] = tab;
                    });

                    return Item.findByContainer(user, container._id).then(function (items) {
                        var promises = [];

                        var itemsExternalIdCache = {};

                        items.forEach(function (item) {
                            itemsExternalIdCache[item.externalId] = item;

                            if (!tabExternalIdCache[item.externalId]) {
                                item.containers.remove(container._id);
                                updatedItems.push(item);
                                promises.push(item.saveWithPromise());
                            }
                        });                        
                        window.tabs.forEach(function (tab) {
                            var item = itemsExternalIdCache[tab.externalId];
                            if (!item) {
                                var item = new Item({
                                    externalId: tab.externalId,
                                    title: tab.title,
                                    url: tab.url,
                                    //TODO: we need to download favicon and no use external URL
                                    favicon: 'http://www.google.com/s2/favicons?domain=' + encodeURIComponent(tab.url),
                                    type: 0,
                                    user: user._id,
                                    containers: [container._id]
                                });
                                createdItems.push(item);
                                promises.push(item.saveWithPromise());
                            } 
                            else {
                                //We check if url in the tab changed
                                if(item.url != tab.url) {
                                    item.title = tab.title;
                                    item.url = tab.url;
                                    item.favicon = 'http://www.google.com/s2/favicons?domain=' + encodeURIComponent(item.url);
                                    updatedItems.push(item);
                                    promises.push(item.saveWithPromise());                                                          
                                }
                            }
                        });

                        return Q.all(promises);
                    });
                }));
            })
            .fail(error.sendIfFailed(res))//by default it send 500
            .then(function () {
                res.send('Ok');//TODO i think need to send something else?
            })
            .then(function() {
                if(!req.listboard) userUpdate.createListboard(userId, listboard);
            })
            .then(userUpdate.bulkCreateContainer.bind(null, userId, listboardId, createdContainers))
            .then(userUpdate.bulkDeleteContainer.bind(null, userId, listboardId, deletedContainers))
            .then(userUpdate.bulkCreateItem.bind(null, userId, createdItems))
            // some have the url updated others are not deleted, but marked as deleted //TODO: should we delete them
            .then(userUpdate.bulkUpdateItem.bind(null, userId, updatedItems))
            .done();
    })

}
