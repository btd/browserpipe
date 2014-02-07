var Handler = require('./handler'),
    htmlparser = require('htmlparser2');

function getFavicon(url) {
  //TODO: scrap favicon correctlyi
  return 'http://www.google.com/s2/favicons?domain=' + encodeURIComponent(url);
}

module.exports.parseHTML = function(url, html, callback) {
  var handler = new Handler(url, function (error, htmlObj) {
    //TODO: handle error
    htmlObj.favicon = getFavicon(url);
    callback(htmlObj)
  });
  
  var parser = new htmlparser.Parser(handler);
  parser.write(html);
  parser.done();
}

