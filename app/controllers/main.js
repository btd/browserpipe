/* jshint node: true */

var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    Item = mongoose.model('Item'),
    List = mongoose.model('List');

//Home
exports.home = function (req, res) {
    if (req.isAuthenticated()) {

        var nowListboards = req.user.nowListboards;
        var laterListboards = req.user.laterListboards;
        var futureListboards = req.user.futureListboards;
        List.getAll(req.user)
            .then(function (lists) {
                //We only load the ones from opened containers
                var listboards = _.union(nowListboards, laterListboards, futureListboards);
                //Remove non active containers
                 _(listboards).map(function (listboard) {
                    listboard.containers = listboard.containers.filter(function(cont) {
                        return cont.active;
                    })
                });                
                //Load container ids
                var containerIds = _(listboards).map(function (listboard) {
                    return _.map(listboard.containers, '_id');
                }).flatten().value();

                var filters = _.map(lists, 'fullPath');

                var itemsByContainersPromise = Item.findAllActiveByContainers(
                        req.user,
                        containerIds
                    );
                var itemsByListsPromise = Item.findAllActiveByLists(
                        req.user,
                        filters
                    );

                return q.all([
                        itemsByContainersPromise,
                        itemsByListsPromise
                    ])
                    .spread(function (itemsByContainers, itemsByLists) {
                        return [lists, _.union(itemsByContainers, itemsByLists)];
                    });
            }).spread(function (lists, items) {
                res.render('main/home', {
                    user: req.user,
                    nowListboards: nowListboards,
                    laterListboards: laterListboards,
                    futureListboards: futureListboards,
                    items: items,
                    lists: lists
                });
            }).fail(function (err) {
                console.log(err)
                res.render('500')
            }).done();
    }
    else
        res.render('main/index')
}

//Chrome Extension
exports.chromeExtension = function (req, res) {
    res.contentType('application/x-chrome-extension');
    res.sendfile('app/extensions/chrome/build/1.0/extension.crx');
}



