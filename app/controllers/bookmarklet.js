/* jshint node: true */
var _ = require('lodash')

//Login dialog
exports.login = function (req, res) {

  var errors = _.map(req.flash().error, function(error) { return { msg: error}});
  res.render('bookmarklet/login', {
    title: 'Login',
    errors: errors
  });
}

//Serve bookmarklet
exports.start = function (req, res) {

  res.render('bookmarklet/manage', {
      pickFolder: req.query.pick_folder === 0
  });
}
