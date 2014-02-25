var Base = require('./base');

var url = require('url');

var tags = { 
  a: [ 'href' ],
  img: [ 'src', 'longdesc', 'usemap' ],
  input: [ 'src', 'formaction', 'usemap' ],
  area: [ 'href' ],
  base: [ 'href' ],
  del: [ 'cite' ],
  form: [ 'action' ],
  head: [ 'profile' ],
  blockquote: [ 'cite' ],
  ins: [ 'cite' ],
  q: [ 'cite' ],
  body: [ 'background' ],
  link: [ 'href' ],
  button: [ 'formaction' ],
  command: [ 'icon' ],
  html: [ 'manifest' ]
};


var AbsUrlHandler = function(options) {
  this.urlReplaceFunc = makeUrlReplacer(options.url);

  Base.apply(this, arguments);
};

AbsUrlHandler.prototype = Object.create(Base.prototype);

AbsUrlHandler.prototype.processTag = function(replaceAttributes, attributes) {
  var that = this;

  function replaceUrl(url) {
    return that.replaceUrl(url);
  }

  replaceAttributes.forEach(function(attr) {
    if(attributes[attr]) {
      attributes[attr] = replaceUrl(attributes[attr]);
    }
  });
};

//http://stackoverflow.com/questions/7544550/javascript-regex-to-change-all-relative-urls-to-absolute
AbsUrlHandler.prototype.replaceUrl = function(_url) {
  return this.urlReplaceFunc(_url);
};

AbsUrlHandler.prototype.onOpenTag = function(name, attributes, next) {
  var replaceAttributes = tags[name];
  var that = this;
  function replaceUrl(url) {
    return that.replaceUrl(url);
  }

  if(name == 'style') {
    this.inStyle = true;
  }

  if(replaceAttributes) {
    this.processTag(replaceAttributes, attributes);
  }
  if(attributes.style) {
    attributes.style = replaceStyleUrl(attributes.style, replaceUrl);
  }
  next();
};

AbsUrlHandler.prototype.onCloseTag = function(name, next) {
  if(name == 'style') {
    this.inStyle = false;
  }
  next();
};

AbsUrlHandler.prototype.onText = function(textObj, next) {
  var that = this;
  function replaceUrl(url) {
    return that.replaceUrl(url);
  }

  if(this.inStyle) {
    textObj.text = replaceStyleUrl(textObj.text, replaceUrl);
  }

  next();
};

function makeUrlReplacer(baseUrl) {
  var parsedUrl = url.parse(baseUrl);
  return function(_url) {
    if(/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(_url))
      return _url; //Url is already absolute

    if(_url.substring(0, 2) == "//")
      return parsedUrl.protocol + _url;
    else if(_url.charAt(0) == "/")
      return parsedUrl.protocol + "//" + parsedUrl.host + _url;
    else if(_url.substring(0, 2) == "./")
      return url.resolve(baseUrl, _url);
    else if(/^\s*$/.test(_url))
      return ""; //Empty = Return nothing
    else
      return url.resolve(baseUrl, _url);
  }
}

function unQuote(text) {
  if(text[0] == '"' && text[text.length - 1] == '"') return text.substring(1, text.length - 1);
  if(text[0] == "'" && text[text.length - 1] == "'") return text.substring(1, text.length - 1);
  return text;
}

function replaceStyleUrl(style, replace) {
  return style.replace(/url\(([^)]+)\)/g, function(_, url) {
    return 'url(' + replace(unQuote(url)) + ')';
  });
}


module.exports = AbsUrlHandler;
module.exports.replaceStyleUrl = replaceStyleUrl;
module.exports.makeUrlReplacer = makeUrlReplacer;
