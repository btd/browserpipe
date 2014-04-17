var csLength = 'charset='.length;

var Url = require('url');
var pathMod = require('path');

var Mimoza = require('mimoza');

exports.process = function(rawContentType) {
  var splitted = rawContentType.trim().toLowerCase().split(";");
  return splitted.length == 2 ?
    new ContentType(splitted[0], splitted[1].trim().substr(csLength)) :
    new ContentType(splitted[0]);
};

function ContentType(type, charset) {
  this.type = type;
  this.charset = charset;
}

ContentType.prototype = {
  toString: function() {
    return this.type + (this.charset ? '; charset=' + this.charset : '');
  },
  hasCharset: function() {
    return this.charset != null;
  }
}

//TODO remove and replace with checking on actual needs like isHtml, isText etc
exports.resolveType = function(contentType) {
  switch(contentType) {
    case 'text/html':
    case 'application/xhtml+xml':
      return 'html';

    case 'application/xml':
      return 'xml';

    case 'text/css':
      return 'css';

    case 'application/x-javascript':
    case 'application/javascript':
    case 'application/ecmascript':
      return 'js';

    case 'image/png':
    case 'image/gif':
    case 'image/jpeg':
    case 'image/x-icon':
      return 'img';

    default:
      return 'other';
  }
}

//TODO remove as it is not safe
exports.guessByUrl = function(url) {
  var parsedUrl = Url.parse(url);
  var ext = pathMod.extname(parsedUrl.path);

  switch(ext) {
    case '.jpg':
    case '.jpeg':
      return new ContentType('image/jpeg');

    case '.gif':
      return new ContentType('image/gif');

    case '.png':
      return new ContentType('image/png');

    default:
      return exports.OctetStream;
  }
};

exports.CSS = new ContentType('text/css');
exports.HTML = new ContentType('text/html');

exports.OctetStream = new ContentType('application/octet-stream');
exports.Default = exports.OctetStream;

exports.isBinary = function(contentType) {
  return !Mimoza.isText(contentType);
}

exports.resolveExtension = function(contentType) {
  return Mimoza.getExtension(contentType);
}
