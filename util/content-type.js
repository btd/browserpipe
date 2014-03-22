var csLength = 'charset='.length;

exports.process = function(rawContentType) {
  var splitted = rawContentType.trim().toLowerCase().split(";");
  return splitted.length == 2 ? { type: splitted[0], charset: splitted[1].trim().substr(csLength) } :
  { type: splitted[0] };
};

function ContentType(type, charset) {
  this.type = type;
  this.charset = charset;
}

ContentType.prototype = {
  toString: function() {
    return this.type + this.charset ? '; charset=' + this.charset : '';
  }
}

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

exports.resolveExtension = function(contentType) {
  switch(contentType) {
    case 'text/html':
    case 'application/xhtml+xml':
      return '.html';

    case 'application/xml':
      return '.xml';

    case 'text/css':
      return '.css';

    case 'application/x-javascript':
    case 'application/javascript':
    case 'application/ecmascript':
      return '.js';

    case 'image/png':
      return '.png';
    case 'image/gif':
      return '.gif';
    case 'image/jpeg':
      return '.jpg';
    case 'image/x-icon':
      return '.ico';

    default:
      return '';
  }
}