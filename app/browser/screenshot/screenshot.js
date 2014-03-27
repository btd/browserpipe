var config = require('../../../config'),
  phantom = require('node-phantom');

var gm = require('gm');

var file = require('../../../util/file');

var _ph;

phantom.create(function(err, ph) {
  if(err) return console.error('Could not create PhantomJS instance', err);
  _ph = ph;
}, {
  parameters: {
    'web-security': 'no',
    'ignore-ssl-errors': 'yes'
  }
});


var noScreenshotUrl = '/public/screenshots/no_screenshot.png';

var thumbnailWidth = 260;

var badResult = { success: false, screenshotFull: false, screenshotSmall: noScreenshotUrl };

var generateScreenshot = function(html, width, height, callback) {
  _ph.createPage(function(err, page) {

    //TODO we should set base width, because if user get screenshots on cellphone and then see them on PC it is a strange
    page.set('viewportSize', { width: width, height: height }, function(error) {
      if(error) {
        console.log('Error setting viewportSize: %s', error);
        callback(badResult);
      } else {
        page.set('content', html, function(error) {
          if(error) {
            console.log('Error setting content: %s', error);
            callback(badResult);
          } else {
            var name = file.randomName(config.screenshot.extension);
            var fullPath = file.fullRandomPath(name);

            //We have to wait a bit for phantomjs to finish creating page
            setTimeout(function() {
              return file.mkdirp(fullPath).then(function() {
                page.render(fullPath, function(error) {
                  if(error) {
                    console.log('Error rendering page: %s', error);
                    callback(badResult);
                  } else {
                    var screenshotSmall = file.randomName('.png');
                    var screenshotSmallPath = file.fullRandomPath(screenshotSmall);
                    return file.mkdirp(screenshotSmallPath).then(function() {
                      gm(fullPath)
                        .resize(thumbnailWidth)
                        .write(screenshotSmallPath, function(err) {
                          if(err) {
                            console.log('Error resizing page: %s', err);
                            return callback({ success: true, screenshotFull: file.url(name) });
                          }//XXX
                          callback({ success: true, screenshotFull: file.url(name), screenshotSmall: file.url(screenshotSmall) });
                        })
                    }, function() {
                      callback({ success: true, screenshotFull: file.url(name) });//XXX
                    })
                  }
                })
              }, function() {
                callback(badResult);
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

