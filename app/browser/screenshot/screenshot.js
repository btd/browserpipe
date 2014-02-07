var config = require('../../../config'),
    phantom=require('node-phantom');
  
var _ph;
console.time("phantom-creation");
phantom.create(function(err,ph) {
  console.timeEnd("phantom-creation");
  _ph = ph;
});

function getPicturePath(itemId) {
  var format = config.screenshot.format || 'jpg';
  return config.storePath + '/' + itemId + '.' + format;
}

function getPictureUrl(itemId) {
  var format = config.screenshot.format || 'jpg';
  return config.storeUrl + '/' + itemId + '.' + format;
}

var generateScreenshot = function(html, itemId, callback) {
  console.time("page-creation");
  return _ph.createPage(function(err,page) {
    console.timeEnd("page-creation");
    page.set('content', html, function () {
      var screenshot_path = getPicturePath(itemId);
      console.time("page-getScreenshot");
      page.render(screenshot_path);
      console.timeEnd("page-getScreenshot");
      callback(getPictureUrl(itemId));
    })
  });
}

exports.generateScreenshot = generateScreenshot 
