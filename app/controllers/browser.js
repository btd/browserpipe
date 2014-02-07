var send401IfNotAuthenticated = require('../middlewares/authorization').send401IfNotAuthenticated,
    cors = require('../middlewares/cors'),
    errors = require('../errors'),
    Q = require('q'),
    _ = require('lodash'),
    Item = require('../../models/item'),
    logger = require('rufus').getLogger('app.browsers.sync');

var userUpdate = require('./user_update');

var checkBrowserKey = function (req, res, next) {
    var browserKey = (req.params.browserKey || '').trim();
    if (browserKey.length > 0) {
        req.browserKey = browserKey;
        Item.by({ browserKey: browserKey }).then(function(item) {
            req.listboard = item;
            next();
        }, next);
    } else {
        errors.sendBadRequest(res);
    }
};

function makeCache(arr, field) {
    var cache = {};
    arr.forEach(function(el) {
        cache[el[field]] = el;
    })
    return cache;
}


module.exports = function(app) {
    cors(app, 'post', '/api/v1/browsers/:browserKey', send401IfNotAuthenticated, checkBrowserKey, function(req, res) {
        var body = req.body, listboard = req.listboard, user = req.user, userId = user._id;

        var createdItems = [];
        var updatedItems = [];

        if(!listboard) {
            listboard = Item.newContainer({ user: req.user, title: 'My ' + body.browserName + ' browser', browserKey: req.browserKey });
            createdItems.push(listboard);
            logger.debug('Create new listboard item %s', listboard._id);
            user.browserListboards.push(listboard._id);
        }
        listboard.lastSync = new Date();
        var listboardId = listboard._id;

        logger.debug('Begin sync tabs <--> containers');

        //load containers
        Item.all({ parent: listboardId }).then(function(containers) {
            var containerExternalIdCache = makeCache(containers, 'externalId');
            var windowExternalIdCache = {};

            // sync add new windows <--> containers
            body.windows.forEach(function (window) {
                //each window mapped to container
                var container = containerExternalIdCache[window.externalId];
                if (!container) {
                    logger.debug('Container for window %d does not exists, create new one', window.externalId);
                    container = listboard.addContainer({
                        title: 'browser window',
                        externalId: window.externalId
                    });
                    containerExternalIdCache[window.externalId] = container;
                    createdItems.push(container);
                }

                windowExternalIdCache[window.externalId] = window;
            });

            // remove containers that already was closed as tabs
            _.each(containerExternalIdCache, function (container, externalId) {
                if (!windowExternalIdCache[externalId]) {
                    logger.debug('Container %d does not exists, remove it', externalId);
                    listboard.items.remove(container._id);
                    delete containerExternalIdCache[externalId];
                }
            });

            logger.debug('Begin sync bookmarks <--> tabs');

            // second we sync new structure with items/urls
            return Q.all(_.map(containerExternalIdCache, function(container) {
                logger.debug('Begin sync bookmarks in container %d', container.externalId);
                var window = windowExternalIdCache[container.externalId];

                var tabExternalIdCache = makeCache(window.tabs, 'externalId');
                updatedItems.push(container);

                return Item.all({ parent: container._id }).then(function(bookmarks) {
                    var itemsCache = makeCache(bookmarks, 'externalId');

                    var itemPromises = [];

                    _.each(tabExternalIdCache, function(tab, externalId) {
                        var item = itemsCache[externalId];
                        if(item) { //item with this external id found
                            logger.debug('Bookmark %d found do not sync if url not chainged', externalId);
                            if(item.url != tab.url) {
                                item.title = tab.title;
                                item.url = tab.url;
                                item.favicon = tab.favicon || ('http://www.google.com/s2/favicons?domain=' + encodeURIComponent(tab.url));

                                updatedItems.push(item);
                                itemPromises.push(item.saveWithPromise());
                            }
                            delete itemsCache[externalId];
                        } else {
                            logger.debug('Bookmark %d not found create new', externalId);
                            item = container.addBookmark({
                                externalId: tab.externalId,
                                title: tab.title,
                                url: tab.url,
                                favicon: tab.favicon || ('http://www.google.com/s2/favicons?domain=' + encodeURIComponent(tab.url))
                            });

                            createdItems.push(item);
                            itemPromises.push(item.saveWithPromise());
                        }
                    });

                    _.each(itemsCache, function(item) {
                        logger.debug('Remove bookmark that already does not exist', item._id);
                        container.items.remove(item._id);
                    });

                    itemPromises.push(container.saveWithPromise());

                    return Q.all(itemPromises);
                });
            }))
        })
        .then(function() {
            return listboard.saveWithPromise();
        })
        .then(function() {
            return user.saveWithPromise();
        })
        .then(function () {
            res.send('Ok');//TODO i think need to send something else?
        })
        .then(userUpdate.bulkCreateItem.bind(null, userId, createdItems))
        .then(userUpdate.bulkUpdateItem.bind(null, userId, updatedItems))
        .then(userUpdate.updateUser.bind(null, userId, user))
        .done();
    });

    var addItemToItem = require('./item').addItemToItem;

    cors(app, 'post', '/api/v1/browsers/:browserKey/later', send401IfNotAuthenticated, checkBrowserKey, function(req, res) {
        var user = req.user, listboardId = user.laterListboard;

        Item.by({ _id: listboardId }).then(function(parent) {
            return addItemToItem(parent, req, res);
        })
        .done();
    })
}
