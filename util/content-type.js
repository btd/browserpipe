var csLength = 'charset='.length;

var Promise = require('bluebird');

var Mimoza = require('mimoza');
var mime = new Mimoza({ preloaded: true, defaultType: 'application/octet-stream' });

mime.register('application/font-woff', ['woff']);
mime.register('font/woff', ['woff']);
mime.register('application/vnd.ms-fontobject', ['eot']);

var mmm = require('mmmagic'),
  Magic = mmm.Magic;

var url = require('url');
var path = require('path');

exports.process = function (rawContentType) {
  var splitted = String(rawContentType).trim().toLowerCase().split(";");
  return splitted.length == 2 ?
    new ContentType(splitted[0], splitted[1].trim().substr(csLength)) :
    new ContentType(splitted[0]);
};

function ContentType(type, charset) {
  this.type = type;
  this.charset = charset;
}

ContentType.prototype = {
  toString: function () {
    return this.type + (this.charset ? '; charset=' + this.charset : '');
  },
  hasCharset: function () {
    return this.charset != null;
  }
};

exports.ContentType = ContentType;

exports.isHtml = function (ct) {
  switch (ct) {
    case 'text/html':
    case 'application/xhtml+xml':
      return true;
  }
  return false;
};

exports.isCss = function (ct) {
  switch (ct) {
    case 'text/css':
      return true;
  }
  return false;
};

exports.isImage = function (ct) {
  return /image\/.*/.test(ct);
};

exports.CSS = new ContentType('text/css', 'utf-8');
exports.HTML = new ContentType('text/html', 'utf-8');
exports.Text = new ContentType('text/plain', 'utf-8');

exports.OctetStream = new ContentType('application/octet-stream');
exports.Default = exports.OctetStream;

exports.isBinary = function (contentType) {
  return !Mimoza.isText(contentType);
};

exports.resolveExtension = function (contentType) {
  return mime.getExtension(contentType);
};

exports.byExtension = function(ext) {
  return mime.getMimeType(ext);
};

exports.chooseExtension = function(_url, contentType) {
  var parsed = url.parse(_url);
  var p = parsed.pathname;
  var ext = path.extname(p);
  if(contentType == exports.OctetStream.type || contentType == exports.Text.type) {
    return ext || mime.getExtension(contentType);
  } else {
    return mime.getExtension(contentType);
  }
}

exports.guessContentTypeMagically = function (buffer) {
  var magic = new Magic( mmm.MAGIC_MIME_TYPE);

  return new Promise(function(resolve, reject) {
    magic.detect(buffer, function (err, result) {
      if (err) return reject(err);

      resolve(exports.process(result));
    });
  })
};
