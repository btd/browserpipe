var _ = require('lodash'),
  Item = require('../../models/item'),
  errors = require('../errors'),

  Promise = require('bluebird');

var Browser = require('../browser/browser');

var logger = require('rufus').getLogger('app.bookmarklet');

var Promise = require('bluebird');

var file = require('../../util/file');

var contentType = require('../../util/content-type');

var screenshot = require('../browser/screenshot/screenshot');

var navigate = require('../browser/main').navigate;

var file = require('../../util/file');

var userUpdate = require('./user_update');

//GET
exports.addUrl = function (req, res) {
  req.check('url').notEmpty();

  var errs = req.validationErrors();
  if (errs) return errors.sendBadRequest(res);

  var item = new Item({ url: req.query.url, title: req.query.title });
  item.user = req.user._id;

  return item.saveWithPromise()
    .then(function () {
      if (req.query.next) {
        res.redirect(req.query.next == 'back' ? req.query.url : req.query.next);
      }
    })
    .then(userUpdate.createItem.bind(null, req.user._id, item))
    .then(function () {
      if (item.url) {
        return navigate({
          url: item.url,
          item: item,
          languages: req.user.langs
        });
      }
    });
};

//POST
exports.addPage = function (req, res) {
  req.check('url').notEmpty();
  req.check('html').notEmpty();

  var errs = req.validationErrors();
  if (errs) return errors.sendBadRequest(res);

  var user = req.user;
  var url = req.body.url;
  var html = req.body.html;
  var width = req.body.width;
  var height = req.body.height;

  //We save item on root
  var item = new Item({
    url: url,
    user: user._id,
    windowWidth: width,
    windowHeight: height
  });

  var ct = contentType.HTML;

  var browser = new Browser(user.langs);

  return item.saveWithPromise()
    .then(function () {
      res.send(200);
    })
    .then(function () {
      return browser.processHtml(url, html, ct)
        .then(function (data) {
          logger.debug('Load data from bookmarklet url %s', url);

          var ext = contentType.chooseExtension(url, ct.type);
          return Promise.join(browser.saveData(data.content, ext), browser.generateScreenshot(data.content))
            .spread(function (path, screenshotUrl) {
              item.title = data.title;
              item.url = url;
              item.favicon = data.favicon;
              item.screenshot = screenshotUrl;
              item.path = path;
              item.statusCode = 200;
              item.files = browser.files;

              return item.saveWithPromise()
            })
            .then(userUpdate.updateItem.bind(null, req.user._id, item))
        })
        .error(function (e) {
          logger.debug('Error processing bookmarklet for url %s:', url, e);
          errors.sendBadRequest(res);
        })
    })
    .then(userUpdate.createItem.bind(null, req.user._id, item))
}