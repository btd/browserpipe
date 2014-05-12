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
                    appUrl: config.appUrl,
                    userLimit: config.userLimit
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
              appUrl: config.appUrl,
              userLimit: config.userLimit //we can set it per use there
          }
      })
  }, next)
}

exports.bookmarkletOpen = function (req, res, next) {
  return res.render('main/bookmarklet_open')
}



