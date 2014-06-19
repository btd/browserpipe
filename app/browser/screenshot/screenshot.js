var config = require('../../../config'),
  phantom = require('node-phantom');

var Promise = require('bluebird');

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
var badResult = { success: false, screenshotFull: false, screenshotSmall: noScreenshotUrl };

var generateScreenshot = function(html, browser, callback) {
  _ph.createPage(function(err, page) {
    page.set('viewportSize', config.screenshot.viewportSize, function(error) {
      if(error) {
        console.log('Error setting viewportSize: %s', error);
        callback(badResult);
      } else {
        page.set('content', html, function(error) {
          page.evaluate(function() {
            if(!document.body.style.background) {
              document.body.style.backgroundColor = 'white';
            }
          }, function() {
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

                      var screenshotSmall = file.randomName(config.screenshot.extension);
                      var screenshotSmallPath = file.fullRandomPath(screenshotSmall);
                      return file.mkdirp(screenshotSmallPath).then(function() {
                        gm(fullPath)
                          .resize(config.screenshot.thumbnailWidth)
                          .write(screenshotSmallPath, function(err) {
                            if(err) {
                              console.log('Error resizing page: %s', err);
                              return file.size(fullPath).then(function(size) {
                                browser.files.push({ name: name, size: size });
                                callback({ success: true, screenshotFull: file.url(name) });//XXX
                              });
                            }//XXX

                            return Promise.join(file.size(fullPath), file.size(screenshotSmallPath))
                              .spread(function(fullSize, smallSize) {
                                browser.files.push({ name: name, size: fullSize });
                                browser.files.push({ name: screenshotSmall, size: smallSize });
                                callback({ success: true, screenshotFull: file.url(name), screenshotSmall: file.url(screenshotSmall) });
                              });
                          })
                      }, function() {
                        return file.size(fullPath).then(function(size) {
                          browser.files.push({ name: name, size: size });
                          callback({ success: true, screenshotFull: file.url(name) });//XXX
                        });
                      })
                    }
                  })
                }, function() {
                  callback(badResult);
                });
              }, 1000);
            }
          })
        })
      }
    })
  });
}

exports.generateScreenshot = generateScreenshot;
exports.noScreenshotUrl = noScreenshotUrl;

