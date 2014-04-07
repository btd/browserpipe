/* jshint node: true */
var _ = require('lodash')

//Login dialog
exports.login = function (req, res) {

  res.setHeader("Access-Control-Allow-Origin", req.get('origin'));
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");

  var errors = _.map(req.flash().error, function(error) { return { msg: error}});
  res.render('bookmarklet/login', {
    title: 'Login',
    errors: errors
  });
}

//Serve bookmarklet
exports.start = function (req, res) {

  res.setHeader("Access-Control-Allow-Origin", req.get('origin'));
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");

  res.render('bookmarklet/manage', {
      pickFolder: req.query.pick_folder === 0
  });
}
