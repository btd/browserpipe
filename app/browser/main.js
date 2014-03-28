var Item = require('../../models/item'),
  userUpdate = require('../controllers/user_update'),
  errors = require('../errors'),
  Browser = require('./browser');

var logger = require('rufus').getLogger('browser');

var Promise = require('bluebird');

var screenshot = require('./screenshot/screenshot');

var file = require('../../util/file');

var contentType = require('../../util/content-type');

function generateScreenshot(html, width, height) {
  return new Promise(function(resolve, reject) {
    screenshot.generateScreenshot(html, width, height, function(screenshotData) {
      resolve(screenshotData.screenshotSmall || screenshot.noScreenshotUrl);
    })
  })
}


var sendAndSaveContent = function(res, opts, data) {
  res.send(data.content);
  return Promise.all([Item.byId(opts.itemId), generateScreenshot(data.content, opts.width, opts.height), Browser.save(data.content, data.contentType)])
    .spread(function(item, screenshotUrl, path) {
      item.title = data.title;
      item.url = opts.url;
      item.windowWidth = opts.width;
      item.windowHeight = opts.height;
      item.favicon = data.favicon;
      item.screenshot = screenshotUrl;
      item.path = path;
      item.statusCode = 200;

      return  Promise.cast(item.save())
        .then(function() {
          userUpdate.updateItem(item.user, item);
        })
    });
};

var navigate = function(res, opts) {
  var browser = new Browser(opts.languages);

  return browser._loadUrl(opts.url, true)
    .then(function(data) {
      logger.debug('Load data from url %s data type %s html5 %s', opts.url, data.type);
      switch(data.type) {
        case 'html':
        case 'css':
        case 'js':
        case 'text':
        case 'img':
          return sendAndSaveContent(res, opts, data);
        default:
          return;
      }
    })
    .catch(StatusCode4XXError, function(e) {
      manageItemCodeError(res, opts, e.statusCode);
    })
    .error(function(e) {
      logger.debug('Error loading url %s:', opts.url, e);
      manageItemCodeError(res, opts, 500);
    })
};

var StatusCode4XXError = function(e) {
  return e.statusCode >= 400 && e.statusCode < 500;
};

var manageItemCodeError = function(res, opts, code) {
  sendItemCodeErrorResponse(res, code);
  Item.byId(opts.itemId)
    .then(function(item) {
      item.title = opts.url;
      //TODO: we can have better images in the future regarding the error code
      item.screenshot = screenshot.noScreenshotUrl;
      item.windowWidth = opts.width;
      item.windowHeight = opts.height;
      item.statusCode = code;
      Promise.cast(item.save())
        .then(function() {
          userUpdate.updateItem(item.user, item);
        })
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
      return navigate(res, { url: item.url, itemId: item._id, languages: user.langs, width: width, height: height });
    }
  }
  else if(req.query.url) return navigate(res, { url: req.query.url, itemId: item._id, languages: user.langs, width: width, height: height });
  else return errors.sendBadRequest(res);
}

