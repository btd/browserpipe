var Item = require('../../models/item'),
  StorageItem = require('../../models/storage-item'),
  userUpdate = require('../controllers/user_update'),
  errors = require('../errors'),
  Browser = require('./browser');

var logger = require('rufus').getLogger('browser');

var Promise = require('bluebird');

var path = require('path'),
  crypto = require('crypto');

var screenshot = require('./screenshot/screenshot');

var writeFile = Promise.promisify(require("fs").writeFile);
var mkdirp = Promise.promisify(require('mkdirp'));

var config = require('../../config');


function randomId() {
  return  crypto.pseudoRandomBytes(2).toString('hex');
}


function addHeaderValue(si, headers, name, constructor) {
  if(headers[name]) {
    var fieldName = name.replace(/-[a-z]/g, function(match) {
      return match[1].toUpperCase();
    });

    si[fieldName] = new (constructor || String)(headers[name]);
  }
}

function saveData(data) {
  var name = path.join(randomId(), randomId(), randomId(), randomId());
  var fullPath = path.join(config.storage.path, name);
  return mkdirp(path.dirname(fullPath))
    .then(function() {
      return writeFile(fullPath, data.content);
    })
    .then(function() {
      var si = new StorageItem({
        url: data.href,
        name: name
      });

      addHeaderValue(si, data.headers, 'content-type');
      addHeaderValue(si, data.headers, 'content-length');
      addHeaderValue(si, data.headers, 'last-modified', Date);

      return Promise.cast(si.save()).then(function() {
        return Promise.fulfilled(si);
      });
    })
}

function generateScreenshot(html, width, height) {
  return new Promise(function(resolve, reject) {
    screenshot.generateScreenshot(html, width, height, function(screenshotURL) {
      resolve(screenshotURL);
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
        .then(function(si) {
          return [si, data.media];
        })
    });
  });
}

var navigate = function(res, opts) {
  var browser = new Browser(opts.languages);

  return browser._loadUrl(opts.url)
    .then(function(data) {
      logger.debug('Load data from url %s data type %s html5 %s', opts.url, data.type, data.html5);
      switch(data.type) {
        case 'html':
          //first we save all stylesheets
          return Promise.all(processCss(data.stylesheetsDownloads, data.stylesheetsAttributes))
            .then(function(sheetData) { //we save them on disk
              var linksHtml = '';
              sheetData.forEach(function(si) {
                linksHtml += Browser.tag('link', { type: 'text/css', rel: 'stylesheet', href: si[0].getUrl(), media: si[1] }, data.html5);
              });

              data.content = data.content[0] + linksHtml + data.content[1];

              res.send(data.content);
              return Promise.all([Item.byId(opts.itemId), generateScreenshot(data.content, opts.width, opts.height), saveData(data)])
                .spread(function(item, screenshotUrl, storageItem) {
                  item.title = data.title;
                  item.url = opts.url;
		  item.windowWidth = opts.width;
		  item.windowHeight = opts.height;
                  item.favicon = data.favicon;
                  item.screenshot = screenshotUrl;
                  item.storageItem = storageItem._id;
		  item.statusCode = 200;

                  return  Promise.cast(item.save())
                    .then(function() {
                      userUpdate.updateItem(item.user, item);
                    })
                });
            });
        case 'css':
          return;
        default:
          return;
      }
    })
    .catch(StatusCode4XXError, function(e){
      manageItemCodeError(res, opts, e.statusCode);
    })
    .error(function (e) {
      manageItemCodeError(res, opts, 500);
    })
};

var StatusCode4XXError = function (e) {
  return e.statusCode >= 400 && e.statusCode < 500;
}

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
    case 400: html = '<center><h2>Invalid request</h2></center>'; break;
    case 401: html = '<center><h2>You are not authorized to view this page</h2></center>'; break;
    case 403: html = '<center><h2>You are not authorized to view this page</h2></center>'; break;
    case 404: html = '<center><h2>Page not found</h2></center>'; break;
    default: html = '<center><h2>Sorry, there was a problem displaying the page</h2></center>';
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
    if(item.statusCode && item.statusCode !== 200)
	sendItemCodeErrorResponse(res, item.statusCode);
    else if(item.storageItem) {
      return Promise.cast(StorageItem.by({ _id: item.storageItem }))
        .then(function(stored) {
          if(stored) {
            return stored.getContent().then(function(content) {
              res.send(content);
            })
          } else if(item.url) {
            return navigate(res, { url: item.url, itemId: item._id, languages: user.langs, width: width, height: height });
          }
          else return errors.sendInternalServer(res);
        })
    } else return navigate(res, { url: item.url, itemId: item._id, languages: user.langs, width: width, height: height });
  }
  else if(req.query.url) return navigate(res, { url: req.query.url, itemId: item._id, languages: user.langs, width: width, height: height });
  else return errors.sendBadRequest(res);
}

