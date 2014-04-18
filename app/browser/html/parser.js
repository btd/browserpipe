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
  var handler = new SanitizeHandler({
    callback: callback,
    browser: this.browser // as it first it can pass it to others
  })
    .addNext((new AbsUrlHandler({ url: url, browser: this.browser })).addNext(new HtmlWriterHandler({ url: url, browser: this.browser })))
    .addNext(new FaviconHandler({ url: url }))
    .addNext(new TitleHandler);
  
  var parser = new htmlparser.Parser(handler);
  parser.write(html);
  parser.done();
};

exports.HtmlProcessor = HtmlProcessor;