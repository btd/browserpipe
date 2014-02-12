var Base = require('./base');

//http://www.w3.org/TR/html5/syntax.html#void-elements
// this tag should not be closed
var voidElements = { area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true };

var HtmlWriteHandler = function() {
  this.content = '';

  //before doctype we can remove whitespace
  this.removeExtraWhiteSpace = true;

  Base.apply(this, arguments);
};

HtmlWriteHandler.prototype = Object.create(Base.prototype);

HtmlWriteHandler.prototype.gather = function(obj) {
  obj.html = this.content;
};

HtmlWriteHandler.prototype.onOpenTag = function(name, attributes) {

  this.content += '<' + name;
  for(var attr in attributes) {
    // it does not un escape entities
    this.content += ' ' + attr + '="' + attributes[attr] + '"';
  }
  this.content += '>';

  if(name == 'head') this.inHead = true;

  if(this.inHead) {
    if(name == 'script' || name == 'style') this.removeExtraWhiteSpace = false;
  }

  if(name == 'body') this.removeExtraWhiteSpace = false;
};

HtmlWriteHandler.prototype.onText = function(text) {

  if(this.removeExtraWhiteSpace)
    this.content += text.replace(/\s+/g, ' ');
  else
    this.content += text;
};

HtmlWriteHandler.prototype.onCloseTag = function(name) {

  if(this.html5 && voidElements[name]) {
    //do nothing as it is html5
  } else {
    this.content += '</' + name + '>';
  }
  if(name == 'head') this.inHead = false;

  if(this.inHead) {
    if(name == 'script' || name == 'style') this.removeExtraWhiteSpace = true;
  }

  if(name == 'body') this.removeExtraWhiteSpace = true;
};

HtmlWriteHandler.prototype.onProcessingInstruction = function(name, value) {

  if(name == '!doctype') {
    if(value == '!DOCTYPE html') this.html5 = true;

    this.content += '<' + value + '>';
  }
};

module.exports = HtmlWriteHandler;