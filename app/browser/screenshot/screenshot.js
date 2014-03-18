var config = require('../../../config'),
  phantom = require('node-phantom'),
  Canvas = require('canvas'),
  Image = Canvas.Image,
  fs = require('fs');

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

require('../../rpc').add(/stop/,
  function(m, done) {
    this.write('stop phantomJs\n');
    _ph.exit(function() {
      done();
    });
  });

function randomId() {
  return  crypto.pseudoRandomBytes(64).toString('hex');
}

function getPicturePath(itemId) {
  var format = config.screenshot.format || 'png';
  return config.storage.path + '/' + itemId + '.' + format;
}

function getPicturePathFull(itemId) {
  var format = config.screenshot.format || 'png';
  return config.storage.path + '/' + itemId + '-full.' + format;
}

function getPictureUrl(itemId) {
  var format = config.screenshot.format || 'png';
  return config.storage.url + '/' + itemId + '.' + format;
}

var noScreenshotUrl = '/screenshots/no_screenshot.png';

var generateScreenshot = function(html, width, height, callback) {
  var itemId = randomId();
  console.time("page-creation");
  _ph.createPage(function(err, page) {
    console.timeEnd("page-creation");
    page.set('viewportSize', { width: width, height: height }, function(error) {
      if(error) {
        console.log('Error setting viewportSize: %s', error);
        callback(noScreenshotUrl);
      }
      else {
        page.set('content', html, function(error) {
          if(error) {
            console.log('Error setting content: %s', error);
            callback(noScreenshotUrl);
          }
          else {
            var screenshot_path_full = getPicturePathFull(itemId);
            //We have to wait a bit for phantomjs to finish creating page
            setTimeout(function() {
              console.time("page-getScreenshot");
              page.render(screenshot_path_full, function(error) {
                console.timeEnd("page-getScreenshot");
                if(error) {
                  console.log('Error rendering page: %s', error);
                  callback(noScreenshotUrl);
                }
                else {
                  console.time("page-cropScreenshot");
                  var screenshot_path = getPicturePath(itemId);
                  var img = new Image;
                  img.onerror = function(error) {
                    console.log('Error cropping screenshot: %s', error);
                    callback(noScreenshotUrl);
                  };
                  img.onload = function() {
                    var wratio = 252 / width,
                      h = img.height * wratio,
                      w = img.width * wratio,
                      canvas = new Canvas(w, h),
                      ctx = canvas.getContext('2d');
                    //We do not crop image anymore;
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
                    var out = fs.createWriteStream(screenshot_path);
                    var stream = canvas.pngStream({
                    });
                    stream.pipe(out);
                    callback(getPictureUrl(itemId));
                  }
                  img.src = screenshot_path_full;
                }
              });
            }, 1000);
          }
        })
      }
    })
  });
}

exports.generateScreenshot = generateScreenshot;
exports.noScreenshotUrl = noScreenshotUrl;

