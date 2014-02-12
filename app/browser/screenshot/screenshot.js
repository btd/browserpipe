var config = require('../../../config'),
  phantom = require('node-phantom');

var crypto = require('crypto');

var _ph;
console.time("phantom-creation");
phantom.create(function(err, ph) {
  if(err) return console.error('Could not create PhantomJS instance', err);
  console.timeEnd("phantom-creation");
  _ph = ph;
}, {
  parameters: {
    'web-security': 'no',
    'ignore-ssl-errors': 'yes'
  }
});

function randomId() {
  return  crypto.pseudoRandomBytes(64).toString('hex');
}

function getPicturePath(itemId) {
  var format = config.screenshot.format || 'png';
  return config.storePath + '/' + itemId + '.' + format;
}

function getPictureUrl(itemId) {
  var format = config.screenshot.format || 'png';
  return config.storeUrl + '/' + itemId + '.' + format;
}

var noScreenshotUrl = '/img/no_screenshot.png';

var generateScreenshot = function(html, callback) {
  var itemId = randomId();
  console.time("page-creation");
  _ph.createPage(function(err, page) {
    console.timeEnd("page-creation");
    page.set('content', html, function(error) {
      if(error) {
        console.log('Error setting content: %s', error);
        callback(noScreenshotUrl);
      }
      else {
        var screenshot_path = getPicturePath(itemId);
        console.time("page-getScreenshot");
        page.render(screenshot_path, function(error) {
          console.timeEnd("page-getScreenshot");
          if(error) console.log('Error rendering page: %s', error);
          callback(getPictureUrl(itemId));
        });
      }
    })
  });
}

exports.generateScreenshot = generateScreenshot;
exports.noScreenshotUrl = noScreenshotUrl;
