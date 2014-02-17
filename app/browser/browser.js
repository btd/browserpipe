var request = require('request');
var parser = require("./parser/parser");
var screenshot = require("./screenshot/screenshot");

function Browser() {

}

//If it cannot make a URL out of it, it searchs term in Google
function processURL(url) {
  //TODO improve regex to also accept data uris and urls that do not start with http or https
  if(url.match(/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/))
    return url;
  else {
    return "http://www.google.com/search?q=" + encodeURIComponent(url);
  };
}

Browser.prototype = Object.create(require('events').EventEmitter.prototype);

Browser.prototype.loadUrl = function(url) {
  var that = this;
  var finalURL = processURL(url);
  //TODO add browser cache?
  request(finalURL, function (error, response, body) {
    if(error) {
      that.emit('html', {
        title: error.message,
        html: '<div>'+error.message+'</div>'
      });
      that.emit('screenshot', screenshot.noScreenshotUrl);
    } else {
      if(response.statusCode === 200) {
        parser.parseHTML(url, body, function (err, data) {
          that.emit('html', data);
          screenshot.generateScreenshot(data.html, function (screenshotURL) {
            that.emit('screenshot', screenshotURL);
          })
        });
      } else {
        var msg = 'Not a 200 status code, but ' + response.statusCode;
        that.emit('html', {
          title: msg,
          html: '<div>'+msg+'</div>'
        });
        that.emit('screenshot', screenshot.noScreenshotUrl);
      }
    }
  });
};

module.exports = Browser;
