var Item = require('../../models/item'),
  userUpdate = require('../controllers/user_update'),
  responses = require('../responses'),
  errors = require('../errors'),
  Browser = require('./browser');

var logger = require('rufus').getLogger('browser');

var Promise = require('bluebird');

var screenshot = require('./screenshot/screenshot');

var util = require('./util');

var file = require('../../util/file');

var contentType = require('../../util/content-type');

function generateScreenshot(html, width, height) {
  return new Promise(function(resolve/*, reject*/) {
    screenshot.generateScreenshot(html, width, height, function(screenshotData) {
      resolve(screenshotData.screenshotSmall || screenshot.noScreenshotUrl);
    })
  })
}

function sendAndSaveContent(res, opts, data) {
  res.send(data.content);
  var item = opts.item;
  return saveContent(item, opts.url, data.content, data.contentType, opts.width, opts.height, data.title, data.favicon)
    .then(function() { userUpdate.updateItem(item.user, item); });
}

function saveContent(item, url, content, ct, width, height, title, favicon) {
  var ext = contentType.chooseExtension(url, ct.type);
  return Promise.all([
    //generateScreenshot(content, width, height)
    Promise.cast(screenshot.noScreenshotUrl),
    item.path ? util.saveDataByName(content, item.path) : util.saveData(content, ext, item)
  ]).spread(function(screenshotUrl, path) {
      item.title = title;
      item.url = url;
      item.windowWidth = width;
      item.windowHeight = height;
      item.favicon = favicon;
      item.screenshot = screenshotUrl;
      item.path = path;
      item.statusCode = 200;

      return Promise.cast(item.save())
    });
}

function navigate(res, opts) {
  var browser = new Browser(opts.languages, opts.item);

  return browser._loadUrl(opts.url, true)
    .then(function(data) {
      logger.debug('Load data from url %s', opts.url);
      return sendAndSaveContent(res, opts, data);
    })
    .catch(StatusCode4XXError, function(e) {
      manageItemCodeError(res, opts, e.statusCode);
    })
    .error(function(e) {
      logger.debug('Error loading url %s:', opts.url, e);
      manageItemCodeError(res, opts, 500);
    })
}

var StatusCode4XXError = function(e) {
  return e.statusCode >= 400 && e.statusCode < 500;
};

var manageItemCodeError = function(res, opts, code) {
  sendItemCodeErrorResponse(res, code);
  var item = opts.item;

  item.title = opts.url;
  //TODO: we can have better images in the future regarding the error code
  item.screenshot = screenshot.noScreenshotUrl;
  item.windowWidth = opts.width;
  item.windowHeight = opts.height;
  item.statusCode = code;

  return Promise.cast(item.save())
    .then(function() {
      userUpdate.updateItem(item.user, item);
    });
}

var sendItemCodeErrorResponse = function(res, code) {
  //TODO: use templates
  var html = '';
  switch(code) {
    case 400:
      html = '<center><h2>Invalid request</h2></center>';
      break;
    case 401:
      html = '<center><h2>You are not authorized to view this page</h2></center>';
      break;
    case 403:
      html = '<center><h2>You are not authorized to view this page</h2></center>';
      break;
    case 404:
      html = '<center><h2>Page not found</h2></center>';
      break;
    default:
      html = '<center><h2>Sorry, there was a problem displaying the page</h2></center>';
  }
  res.status(code).send(html);
}

exports.htmlItem = function(req, res) {
  var item = req.currentItem;
  var user = req.user;
  var width = req.query.width;
  var height = req.query.height;
  if(item.url) {
    logger.debug('Browser open %s for %s', item._id, item.url);
    if(item.statusCode && item.statusCode !== 200) {
      sendItemCodeErrorResponse(res, item.statusCode);
    } else if(item.path) {
      return res.redirect(file.url(item.path));
    } else {
      return navigate(res, {
        url: item.url,
        item: item,
        languages: user.langs,
        width: width,
        height: height
      });
    }
  }
  else if(req.query.url) return navigate(res, {
    url: req.query.url,
    item: item,
    languages: user.langs,
    width: width,
    height: height
  });
  else return errors.sendBadRequest(res);
}


exports.htmlBookmarklet = function(req, res) {

  res.setHeader("Access-Control-Allow-Origin", req.get('origin'));
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");

  req.check('url').notEmpty();
  req.check('html').notEmpty();

  var errs = req.validationErrors();
  if (errs) return errors.sendBadRequest(res);

  var user = req.user;
  var url = req.body.url;
  var parentId = '';
  var html = req.body.html;
  var charset = req.body.charset;
  var width = req.body.width;
  var height = req.body.height;

  //We save item on root
  var item = new Item({ url: url , type: 0, user: user._id });
  if(req.body.archiveParent) {
    item.archiveParent = req.body.archiveParent;
    parentId = item.archiveParent;
  } else {
    item.browserParent = user.browser;
    parentId = item.browserParent;
  }

  var ct = contentType.HTML;

  var browser = new Browser(user.langs, item);

  return Promise.cast(item.save())
    .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
    .then(function() {
      return Item.byId({ _id: parentId })
        .then(function(parent) {
          parent.items.push(item._id);
          parent.markModified('items');
          return Promise.cast(parent.save())
            .then(userUpdate.updateItem.bind(null, req.user._id, parent));
        })
    })
    .then(function() {
      return browser.processHtml(url, html, ct)
        .then(function(data) {
          logger.debug('Load data from bookmarklet url %s', url);
          return saveContent(item, url, data.content, data.contentType, width, height, data.title, data.favicon)
            .then(userUpdate.updateItem.bind(null, req.user._id, item))
        })
        .error(function(e) {
          logger.debug('Error processing bookmarklet for url %s:', url, e);
          errors.sendBadRequest(res);
        })
    })
    .then(userUpdate.createItem.bind(null, req.user._id, item))
}
