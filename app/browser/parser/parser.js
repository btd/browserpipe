var htmlparser = require('htmlparser2');

var TitleHandler = require('./handlers/title');
var HtmlWriterHandler = require('./handlers/html-writer');
var SanitizeHandler = require('./handlers/sanitize');
var FaviconHandler = require('./handlers/favicon');
var AbsUrlHandler = require('./handlers/abs-url');

var tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

var replaceTag = function(tag) {
  return tagsToReplace[tag] || tag;
}

var safeTagsReplace = function(str) {
  return str.replace(/[&<>]/g, replaceTag);
}

//Process html file to optimize and clean it into new html
function HtmlProcessor(browser) {
  this.browser = browser;
}

HtmlProcessor.prototype.process = function(url, html, callback) {
  var handler = new SanitizeHandler({
    callback: callback,
    browser: this.browser // as it first it can pass it to others
  })
    .addNext((new AbsUrlHandler({ url: url, browser: this.browser })).addNext(new HtmlWriterHandler))
    .addNext(new FaviconHandler({ url: url }))
    .addNext(new TitleHandler);
  
  var parser = new htmlparser.Parser(handler);
  parser.write(html);
  parser.done();
};

exports.HtmlProcessor = HtmlProcessor;