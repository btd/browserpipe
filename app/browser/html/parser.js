var htmlparser = require('htmlparser2');

var TitleHandler = require('./handlers/title');
var HtmlWriterHandler = require('./handlers/html-writer');
var SanitizeHandler = require('./handlers/sanitize');
var FaviconHandler = require('./handlers/favicon');
var AbsUrlHandler = require('./handlers/abs-url');


//Process html file to optimize and clean it into new html
function HtmlProcessor(browser) {
  this.browser = browser;
}

HtmlProcessor.prototype.process = function(url, html, callback) {
  var absUrlHandler = new AbsUrlHandler;
  var handler = new SanitizeHandler({
    url: url,
    callback: callback,
    browser: this.browser // as it first it can pass it to others
  })
    .addNext(absUrlHandler)
    .addNext(new FaviconHandler)
    .addNext(new TitleHandler);

  absUrlHandler.addNext(new HtmlWriterHandler);
  
  var parser = new htmlparser.Parser(handler);
  parser.write(html);
  parser.done();
};

exports.HtmlProcessor = HtmlProcessor;