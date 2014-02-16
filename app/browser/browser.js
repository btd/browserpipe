var request = require('request');
var parser = require("./parser/parser");
var screenshot = require("./screenshot/screenshot");

function Browser() {

}

Browser.prototype = Object.create(require('events').EventEmitter.prototype);

Browser.prototype.loadUrl = function(url) {
  var that = this;
  //TODO add browser cache?
  request({
    url: url,
    headers: {
      // we are a fresh firefox
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0'
    }
  }, function (error, response, body) {
    if(error) {
      that.emit('html', {
        title: error.message,
        html: '<div>'+error.message+'</div>'
      });
      that.emit('screenshot', screenshot.noScreenshotUrl);
    } else {
      if(response.statusCode === 200) {
        parser.parseHTML(url, body, function (err, data) {
          if(err) {
            that.emit('html', {
              title: error.message,
              html: '<div>'+error.message+'</div>'
            });
            that.emit('screenshot', screenshot.noScreenshotUrl);
          }
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