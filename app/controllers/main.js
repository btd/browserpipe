/* jshint node: true */

var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    Item = mongoose.model('Item'),
    Folder = mongoose.model('Folder');

//Home
exports.home = function (req, res) {
    if (req.isAuthenticated()) {

        var listboards = req.user.listboards;
        Folder.getAll(req.user)
            .then(function (folders) {                
                //Load container ids
                var containerIds = _(listboards).map(function (listboard) {
                    return _.map(listboard.containers, '_id');
                }).flatten().value();

                var folderIds = _.map(folders, '_id');

                var itemsByContainersPromise = Item.findAllByContainers(
                        req.user,
                        containerIds
                    );
                var itemsByFoldersPromise = Item.findAllByFolders(
                        req.user,
                        folderIds
                    );

                return q.all([
                        itemsByContainersPromise,
                        itemsByFoldersPromise
                    ])
                    .spread(function (itemsByContainers, itemsByFolders) {
                        return [folders, _.union(itemsByContainers, itemsByFolders)];
                    });
            }).spread(function (folders, items) {
                res.render('main/home', {
                    user: req.user,
                    listboards: listboards,
                    items: items,
                    folders: folders
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



