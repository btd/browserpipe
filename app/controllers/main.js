var Item = require('../../models/item');
var config = require('../../config');

var Promise = require('bluebird');

//Home
exports.home = function (req, res, next) {
  if (req.isAuthenticated()) {
    return Promise.join(Item.allTags(), Item.all({ user: req.user._id, deleted: false }))
      .spread(function (tags, items) {
        res.render('main/home', { initialOptions: {
          user: req.user,
          items: items,
          tags: tags,
          config: {
            appUrl: config.appUrl,
            userLimit: config.userLimit
          }
        }})
      }, next)
  } else
    res.render('main/index', { user: req.user})
}

//FAQ
exports.faq = function (req, res, next) {
  return res.render('main/faq', { option: 'faq', user: req.user })
}

//Help
exports.help = function (req, res, next) {
  return res.render('main/help', { option: 'help', user: req.user })
}

//About
exports.about = function (req, res, next) {
  return res.render('main/about', { option: 'about', user: req.user })
}

//Privacy
exports.privacy = function (req, res, next) {
  return res.render('main/privacy', { option: 'privacy', user: req.user })
}

//Help
exports.terms = function (req, res, next) {
  return res.render('main/terms', { option: 'terms', user: req.user })
}

//Bookmarklet
exports.bookmarkletArchive = function (req, res, next) {
  return Item.all({ user: req.user._id, deleted: false }).then(function (items) {
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



