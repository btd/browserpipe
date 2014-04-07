var config = require('../../config');

//Bookmarklet
exports.bookmarklet = function (req, res, next) {
  res.render('modals/bookmarklet', {
    domain: config.appUrl,
    root: req.user.browser
  })
}
