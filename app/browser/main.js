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

var initBrowser = function(socket) {

  var navigate = function(url, itemId) {
    var browser = new Browser;

    return browser._loadUrl(url)
      .then(function(data) {
        logger.debug('Load data from url %s data type %s', url, data.type);
        switch(data.type) {
          case 'html':
            //first we save all stylesheets
            return Promise.map(data.stylesheetsDownloads, saveData)
              .then(function(sheets) { //we save them on disk
                var linksHtml = '';
                sheets.forEach(function(si, index) {
                  var originalAttributes = data.stylesheetsAttributes[index];
                  originalAttributes.href = si.getUrl();
                  linksHtml += Browser.tag('link', originalAttributes, data.html5);
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
