var htmlparser = require('htmlparser2');

var TitleHandler = require('./handlers/title');
var HtmlWriterHandler = require('./handlers/html-writer');
var SanitizeHandler = require('./handlers/sanitize');
var FaviconHandler = require('./handlers/favicon');
var AbsUrlHandler = require('./handlers/abs-url');

module.exports.parseHTML = function(url, html, callback) {
  var handler = new SanitizeHandler({
    callback: callback
  })
    .addNext(new AbsUrlHandler({ url: url }))
    .addNext(new HtmlWriterHandler)
    .addNext(new FaviconHandler({ url: url }))
    .addNext(new TitleHandler);
  
  var parser = new htmlparser.Parser(handler);
  parser.write(html);
  parser.done();
};
