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


function replaceStyleUrl(style, replace) {
  return style.replace(/url\((.*)\)/gi, function(_, url) {
    return 'url(' + replace(url) + ')';
  });
}

var AbsUrlHandler = function(options) {
  this.baseUrl = options.url;
  this.parsedUrl = url.parse(options.url);

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
  if(/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(_url))
    return _url; //Url is already absolute

  if(_url.substring(0, 2) == "//")
    return this.parsedUrl.protocol + _url;
  else if(_url.charAt(0) == "/")
    return this.parsedUrl.protocol + "//" + this.parsedUrl.host + _url;
  else if(_url.substring(0, 2) == "./")
    return url.resolve(this.baseUrl, _url);
  else if(/^\s*$/.test(_url))
    return ""; //Empty = Return nothing
  else
    return url.resolve(this.baseUrl, "../" + _url);
};

AbsUrlHandler.prototype.onOpenTag = function(name, attributes, next) {
  var replaceAttributes = tags[name];
  var that = this;
  function replaceUrl(url) {
    return that.replaceUrl(url);
  }

  if(replaceAttributes) {
    this.processTag(replaceAttributes, attributes);
  }
  if(attributes.style) {
    attributes.style = replaceStyleUrl(attributes.style, replaceUrl);
  }
  next();
};

//TODO process content of style

module.exports = AbsUrlHandler;
