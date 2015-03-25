var Base = require('./base');

var util = require('../../util');

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


var AbsUrlHandler = function() {
  Base.apply(this, arguments);
};

AbsUrlHandler.prototype = Object.create(Base.prototype);

AbsUrlHandler.prototype.init = function() {
  this.urlReplaceFunc = util.makeUrlReplacer(this.url);
}

AbsUrlHandler.prototype.processTag = function(replaceAttributes, attributes) {
  var that = this;

  function replaceUrl(url) {
    if(url[0] == '#') return url;

    var newUrl = that.replaceUrl(url);
    if(newUrl.indexOf(that.url) == 0) {
      var rest = newUrl.substr(that.url.length);
      if(rest[0] == '#') return rest;
    }

    return newUrl;
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

  if(replaceAttributes) {
    this.processTag(replaceAttributes, attributes);
  }
  if(attributes.style) {
    attributes.style = util.replaceStyleUrl(attributes.style, replaceUrl);
  }
  next();
};


module.exports = AbsUrlHandler;
