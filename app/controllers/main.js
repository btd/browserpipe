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
        q.all([Folder.getAll(req.user), Item.getAll(req.user)])
            .spread(function (folders, items) {                
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



