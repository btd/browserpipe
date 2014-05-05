var Item = require('../../models/item');
var config = require('../../config');

//Home
exports.home = function (req, res, next) {
    if (req.isAuthenticated()) {
        return Item.all({ user: req.user._id, deleted: false }).then(function(items) {
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

//Bookmarklet
exports.bookmarkletArchive = function (req, res, next) {
  return Item.all({ user: req.user._id, deleted: false }).then(function(items) {
      res.render('main/bookmarklet_archive', {
          user: req.user,
          items: items,
          config: {
              appUrl: config.appUrl
          }
      })
  }, next)
}

exports.bookmarkletOpen = function (req, res, next) {
  return res.render('main/bookmarklet_open')
}

//Chrome Extension
exports.chromeExtension = function (req, res) {
    res.contentType('application/x-chrome-extension');
    res.sendfile('app/extensions/chrome/build/1.0/extension.crx');
}



