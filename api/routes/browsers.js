var _ = require('lodash'),
    error = require('../error'),
    Q = require('q'),
    userUpdate = require('../../app/controllers/user_update');

var User = require('../../app/models/user'),
    Item = require('../../app/models/item');

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
                container = listboard.addContainer({
                    type: 0,
                    externalId: window.externalId
                });
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
        var deletedItems = [];

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
                                deletedItems.push(item);
                                promises.push(item.saveWithPromise());
                            }
                        });
                        //it seems we need to compare tabs by url not only by external id
                        window.tabs.forEach(function (tab) {
                            if (!itemsExternalIdCache[tab.externalId]) {
                                var item = new Item({
                                    externalId: tab.externalId,
                                    title: tab.title,
                                    url: tab.url,
                                    favicon: tab.favicon,
                                    type: 0,
                                    user: user._id,
                                    containers: [container._id]
                                });
                                createdItems.push(item);
                                promises.push(item.saveWithPromise());
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
            .then(userUpdate.bulkUpdateItem.bind(null, userId, deletedItems))// they are not really deleted
            .done();
    })

}
