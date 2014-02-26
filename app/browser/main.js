var Item = require('../../models/item'),
  StorageItem = require('../../models/storage-item'),
  userUpdate = require('../controllers/user_update'),
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

function generateScreenshot(html) {
  return new Promise(function(resolve, reject) {
    screenshot.generateScreenshot(html, function(screenshotURL) {
      resolve(screenshotURL);
    })
  })
}

var absUrl = require('./parser/handlers/abs-url');

function processCss(css, attributes) {
  return Promise.all(css).then(function(datas) {
    // concat by media attribute (ie8 does not support @media in css)
    var chunks = [{ content: '', media: 'all'}];
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

var initBrowser = function(socket) {

  var navigate = function(url, itemId) {
    var browser = new Browser;

    return browser._loadUrl(url)
      .then(function(data) {
        logger.debug('Load data from url %s data type %s html5 %s', url, data.type, data.html5);
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

                socket.emit("browser.set.html", data.content);
                return Promise.all([Item.byId(itemId), generateScreenshot(data.content), saveData(data)])
                  .spread(function(item, screenshotUrl, storageItem) {
                    item.title = data.title;
                    item.url = url;
                    item.favicon = data.favicon;
                    item.screenshot = screenshotUrl;
                    item.storageItem = storageItem._id;

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
  };

  socket.on('browser.navigate', function(data) {
    logger.debug('Browser navigate %s %s', data.url, data.itemId);
    var url = data.url;
    var itemId = data.itemId;
    navigate(url, itemId);
  });

  socket.on('browser.open', function(data) {
    logger.debug('Browser open %s', data.itemId);
    var itemId = data.itemId;
    return Promise.cast(Item.byId(itemId)).then(function(item) {
      logger.debug('Found item %j', item);
      if(item.storageItem) {
        return Promise.cast(StorageItem.by({ _id: item.storageItem }))
          .then(function(stored) {
            if(stored) {
              return stored.getContent().then(function(content) {
                socket.emit("browser.set.html", content);
              })
            } else if(item.url) {
              return navigate(item.url, itemId);
            }
          })
      } else if(item.url) {
        return navigate(item.url, itemId);
      }
    });
  });

  return  {
    end: function() {
      //put end code if any
    }
  }
}

exports.initBrowser = initBrowser  
