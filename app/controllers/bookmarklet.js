/* jshint node: true */
var _ = require('lodash');
var Item = require('../../models/item');
var config = require('../../config');

//Login dialog
exports.login = function (req, res) {

  var errors = _.map(req.flash().error, function(error) { return { msg: error}});
  res.render('bookmarklet/login', {
    title: 'Login',
    errors: errors
  });
}

//Serve bookmarklet
exports.start = function (req, res, next) {

  return Item.all({ user: req.user._id, deleted: false }).then(function(items) {
      res.render('main/home', {
          user: req.user,
          items: items,
          config: {
              appUrl: config.appUrl
          }
      })
  }, next)
  //res.render('bookmarklet/manage', {
  //});
}
