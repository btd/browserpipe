var Item = require('../../models/item'),
  userUpdate = require('../controllers/user_update'),
  responses = require('../responses'),
  errors = require('../errors'),
  Browser = require('./browser');

var logger = require('rufus').getLogger('browser');

var Promise = require('bluebird');

var screenshot = require('./screenshot/screenshot');

var config = require('../../config');
var file = require('../../util/file');

var contentType = require('../../util/content-type');

function saveData(data) {
  return file.saveData(data.content, contentType.resolveExtension(contentType.process(data.headers['content-type']).type));
}

function generateScreenshot(html, width, height) {
  return new Promise(function(resolve, reject) {
    screenshot.generateScreenshot(html, width, height, function(screenshotData) {
      resolve(screenshotData.screenshotSmall || screenshot.noScreenshotUrl);
    })
  })
}

var absUrl = require('./parser/handlers/abs-url');

function processCss(css, attributes) {
  return Promise.all(css).then(function(datas) {
    // concat by media attribute (ie8 does not support @media in css)
    var chunks = [
      { content: '', media: 'all'}
    ];
    datas.forEach(function(body, index) {
      var attr = attributes[index];
      var media = attr.media || 'all';
      var lastChunk = chunks[chunks.length - 1];

      var content = absUrl.replaceStyleUrl(body.content, absUrl.makeUrlReplacer(body.href));

      if(lastChunk.media == media) {
        lastChunk.content += content;
      } else {
        chunks.push({ content: content, media: media});
      }
    });

    return chunks.map(function(data) {
      return saveData({ content: data.content, headers: { 'content-type': 'text/css', 'content-length': data.content.length }})
        .then(function(name) {
          return [name, data.media];
        })
    });
  });
}

var sendAndSaveContent = function(res, opts, data) {
  res.send(data.content);
  return Promise.all([
      Item.byId(opts.itemId), 
      generateScreenshot(data.content, opts.width, opts.height), 
      saveData(data), 
      opts.url, 
      opts.width,
      opts.height,
      data
    ])
    .spread(saveContent)
    .then(function(item) {
      userUpdate.updateItem(item.user, item);
    });
}

var saveContent = function(item, screenshotUrl, path, url, width, height, data) {
    item.title = data.title;
    item.url = url;
    item.windowWidth = width;
    item.windowHeight = height;
    item.favicon = data.favicon;
    item.screenshot = screenshotUrl;
    item.path = path;
    item.statusCode = 200;

    return  Promise.cast(item.save())
      .then(function() {
	return item; 
      });
}

var navigate = function(res, opts) {
  var browser = new Browser(opts.languages);

  return browser._loadUrl(opts.url, true)
    .then(function(data) {
      logger.debug('Load data from url %s data type %s html5 %s', opts.url, data.type, data.html5);
      switch(data.type) {
        case 'html':

          if(data.stylesheetsDownloads && data.stylesheetsAttributes) {
            return Promise.all(processCss(data.stylesheetsDownloads || [], data.stylesheetsAttributes || []))
              .then(function(sheetData) { //we save them on disk
                var linksHtml = '';
                sheetData.forEach(function(si) {
                  linksHtml += Browser.tag('link', { type: 'text/css', rel: 'stylesheet', href: file.url(si[0]), media: si[1] });
                });

                data.content = data.content[0] + linksHtml + data.content[1];
                return sendAndSaveContent(res, opts, data);
              });
          } else {
            return sendAndSaveContent(res, opts, data);
          }
          break;
        case 'css':
          return sendAndSaveContent(res, opts, data);
          break;
        case 'js':
          return sendAndSaveContent(res, opts, data);
          break;
        case 'text':
          return sendAndSaveContent(res, opts, data);
          break;
        case 'img':
          return sendAndSaveContent(res, opts, data);
          break;
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


exports.htmlBookmaklet = function(req, res) {

  res.setHeader("Access-Control-Allow-Origin", req.get('origin'));
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");

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
  var item = new Item({ url: url , type: 0, parent: user.browser, user: user._id });

  var browser = new Browser(user.langs);

  browser._saveHtml(url, html)
    .then(function(data) {
      logger.debug('Saving html from url %s data type %s html5 %s', url, data.type, data.html5);
      //first we save all stylesheets
      return Promise.all(processCss(data.stylesheetsDownloads, data.stylesheetsAttributes))
	.then(function(sheetData) { //we save them on disk
	  var linksHtml = '';
	  sheetData.forEach(function(si) {
	    linksHtml += Browser.tag('link', { type: 'text/css', rel: 'stylesheet', href: file.url(si[0]), media: si[1] });
	  });

	  data.content = data.content[0] + linksHtml + data.content[1];
	  data.headers['content-type'] = "text/html";

	  return Promise.all([
	    item, 
	    generateScreenshot(data.content, width, height), 
	    saveData(data), 
	    url, 
	    width,
	    height,
	    data
	  ])
	    .spread(saveContent)
            .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
            .then(userUpdate.createItem.bind(null, req.user._id, item))
	    .then(function() {
	      return Item.byId({ _id: item.parent })
	        .then(function(parent) {
	          parent.items.push(item._id);
	          parent.markModified('items'); 
	          return Promise.cast(parent.save())
                    .then(userUpdate.updateItem.bind(null, req.user._id, parent));
		})
	    })
	});
    })
    .error(function() {
      errors.sendBadRequest(res);
    })
    .done();
}
