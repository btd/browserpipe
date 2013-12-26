var Item = require('../../models/item');
var config = require('../../config');

//Home
exports.home = function (req, res, next) {
    if (req.isAuthenticated()) {
        return Item.all({ user: req.user._id }).then(function(items) {
            res.render('main/home', {
                user: req.user,
                items: items,
                config: {
                    appUrl: config.appUrl
                }
            })
        }, next)
    } else
        res.render('main/index')
}

//Chrome Extension
exports.chromeExtension = function (req, res) {
    res.contentType('application/x-chrome-extension');
    res.sendfile('app/extensions/chrome/build/1.0/extension.crx');
}



