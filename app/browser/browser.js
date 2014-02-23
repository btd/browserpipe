var request = require('request');
var parser = require("./parser/parser");
var screenshot = {
  noScreenshotUrl: '/screenshots/no_screenshot.png'
};

var StorageItem = require('../../models/storage-item');
var config = require('../../config');

var Promise = require('bluebird');

var path = require('path'),
  crypto = require('crypto');

var writeFile = Promise.promisify(require("fs").writeFile);
var mkdirp = Promise.promisify(require('mkdirp'));



function randomId() {
  return  crypto.pseudoRandomBytes(2).toString('hex');
}


function Browser() {

}

//If it cannot make a URL out of it, it searchs term in Google
function processURL(url) {
  //TODO improve regex to also accept data uris and urls that do not start with http or https
  if(url.match(/^https?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/))
    return url;
  else {
    /* TODO
    We can load only for now http + https content (and proce ss only html)
    But even with this regexp above restrinct on fully valid urls like
     http://mongoosejs.com/docs/api.html#promise-js
     */
    return url; // TODO think about it more
    //return "http://www.google.com/search?q=" + encodeURIComponent(url);
  }
}

Browser.prototype = Object.create(require('events').EventEmitter.prototype);

Browser.prototype.loadUrl = function(url) {
  var that = this;
  var finalURL = processURL(url);
  //TODO add browser cache?
  request({
    url: finalURL,
    headers: {
      // we are a fresh firefox
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0'
    }
  }, function(error, response, body) {
    if(error) {
      that.produceError(error);
    } else {
      if(response.statusCode === 200) {
        parser.parseHTML(url, body, function(err, data) {
          if(err) return that.produceError(err);
          that.emit('html', data);

          //screenshot.generateScreenshot(data.html, function(screenshotURL) {
          //  that.emit('screenshot', screenshotURL);
          //})
          data.screenshot = screenshot.noScreenshotUrl;
          data.storageItem = that.saveData(response, data.html);
          that.emit('end', data);
        });
      } else {
        that.produceError(new Error('Not a 200 status code, but ' + response.statusCode));
      }
    }
  });
};

Browser.prototype.produceError = function(err) {
  this.emit('html', {
    title: err.message,
    html: '<div>' + err.message + '</div>'
  });
  this.emit('screenshot', screenshot.noScreenshotUrl);
};

Browser.prototype.saveData = function(response, content) {
  var fullPath = path.join(config.storage.path, randomId(), randomId(), randomId(), randomId());
  return mkdirp(path.dirname(fullPath))
    .then(function() {
      return writeFile(fullPath, content);
    })
    .then(function() {
      var si = new StorageItem({
        url: response.request.href,
        contentType: response.headers['content-length'],
        contentLength: response.headers['content-type'],
        lastModified: new Date(response.headers['last-modified']), //TODO add other tags
        name: fullPath
      });
      return Promise.cast(si.save()).then(function() {
        return Promise.fulfilled(si);
      });
    })
};

module.exports = Browser;
