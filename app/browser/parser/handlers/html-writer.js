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
  this.head = '';
  this.body = '';

  this.writeHead = true;

  this.stylesheetsDownloads = [];
  this.stylesheetsAttributes = [];

  //before doctype we can remove whitespace
  this.removeExtraWhiteSpace = true;

  Base.apply(this, arguments);
};

HtmlWriteHandler.prototype = Object.create(Base.prototype);

HtmlWriteHandler.prototype.gather = function(obj) {
  obj.content = [this.head, this.body];
  obj.stylesheetsDownloads = this.stylesheetsDownloads;
  obj.stylesheetsAttributes = this.stylesheetsAttributes;
  obj.html5 = this.html5;
};

HtmlWriteHandler.prototype.add = function(text) {
  if(this.writeHead) {
    this.head += text;
  } else {
    this.body += text;
  }
};

function isStylesheet(name, attributes) {
  return name == 'link' && attributes.rel == 'stylesheet' && ((attributes.type && attributes.type == 'text/css') || !attributes.type) && attributes.href;
}

HtmlWriteHandler.prototype.onOpenTag = function(name, attributes) {
  if(isStylesheet(name, attributes)) {
    this.stylesheetsDownloads.push(this.browser._loadUrl(attributes.href));
    this.stylesheetsAttributes.push(attributes);
  } else {
    this.add('<' + name);
    for(var attr in attributes) {
      // it does not un escape entities
      this.add(' ' + attr + '="' + attributes[attr] + '"');
    }
    this.add('>');

    if(name == 'body') {
      this.removeExtraWhiteSpace = false;
    }
    if(name == 'script' || name == 'style') {
      this.removeExtraWhiteSpace = false;
    }
  }
};

HtmlWriteHandler.prototype.onText = function(text) {
  if(this.removeExtraWhiteSpace)
    this.add(text.replace(/\s+/g, ' '));
  else
    this.add(text);
};

HtmlWriteHandler.prototype.onCloseTag = function(name) {
  if(name == 'head') {
    /*
    i want that
      html
        head
          ...
          <- this place was the end

        body
     */
    this.writeHead = false;
  }

  if(this.html5 && voidElements[name]) {
    //do nothing as it is html5
  } else {
    this.add('</' + name + '>');
  }

  if(name == 'script' || name == 'style') {
    this.removeExtraWhiteSpace = true;
  }

  if(name == 'body') {
    this.removeExtraWhiteSpace = true;
  }
};

HtmlWriteHandler.prototype.onProcessingInstruction = function(name, value) {
  if(name == '!doctype') {
    if(value.toLowerCase() == '!doctype html') this.html5 = true;

    this.add('<' + value + '>');
  }
};

module.exports = HtmlWriteHandler;
module.exports.voidElements = voidElements;