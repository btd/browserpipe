var config = require('../../../config'),
    phantom=require('node-phantom');
  
var _ph;
console.time("phantom-creation");
phantom.create(function(err,ph) {
  console.timeEnd("phantom-creation");
  _ph = ph;
}, {
  parameters:{
    'web-security': 'no',
    'ignore-ssl-errors':'yes'
  }
});

function getPicturePath(itemId) {
  var format = config.screenshot.format || 'png';
  return config.storePath + '/' + itemId + '.' + format;
}

function getPictureUrl(itemId) {
  var format = config.screenshot.format || 'png';
  return config.storeUrl + '/' + itemId + '.' + format;
}

var generateScreenshot = function(html, itemId, callback) {
  console.time("page-creation");
  _ph.createPage(function(err,page) {
    console.timeEnd("page-creation");
    page.set('content', html, function (error) {
      if (error) {
        console.log('Error setting content: %s', error);
	  callback('/img/no_screenshot.png');
      }
      else {
        var screenshot_path = getPicturePath(itemId);
        console.time("page-getScreenshot");
        page.render(screenshot_path, function (error) {
          console.timeEnd("page-getScreenshot");
	  if (error) console.log('Error rendering page: %s', error);
          callback(getPictureUrl(itemId));
        });
      }
    })
  });
}

exports.generateScreenshot = generateScreenshot 
