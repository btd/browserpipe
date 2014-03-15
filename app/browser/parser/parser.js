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


//Converts a css file to be served as html
function CssToHtmlProcessor(browser) {
  this.browser = browser;
}


CssToHtmlProcessor.prototype.process = function(cssText, callback) {
  //TODO: use a syntax highligter for CSS
  var html = '<html><head></head><body>';
  html += safeTagsReplace(cssText);
  html += '<body></html>';
  callback(null, { content : html });
}


//Converts a js file to be served as html
function JsToHtmlProcessor(browser) {
  this.browser = browser;
}


JsToHtmlProcessor.prototype.process = function(jsText, callback) {
  //TODO: use a syntax highligter for JS
  var html = '<html><head></head><body>';
  html += safeTagsReplace(jsText);
  html += '<body></html>';
  callback(null, { content : html });
}

//Converts a text file to be served as html
function TextToHtmlProcessor(browser) {
  this.browser = browser;
}


TextToHtmlProcessor.prototype.process = function(text, callback) {
  var html = '<html><head></head><body>';
  html += safeTagsReplace(text);
  html += '<body></html>';
  callback(null, { content : html });
}


//Converts a image file to be served as html
function ImageToHtmlProcessor(browser) {
  this.browser = browser;
}


ImageToHtmlProcessor.prototype.process = function(url, callback) {
  //TODO: calculate image sizes and set them in style attibute for faster rendering
  var html = '<html><head></head><body><img src="';
  html += url
  html += '" /><body></html>';
  callback(null, { content : html });
}


exports.HtmlProcessor = HtmlProcessor;
exports.CssToHtmlProcessor = CssToHtmlProcessor;
exports.JsToHtmlProcessor = JsToHtmlProcessor;
exports.TextToHtmlProcessor = TextToHtmlProcessor;
exports.ImageToHtmlProcessor = ImageToHtmlProcessor;
