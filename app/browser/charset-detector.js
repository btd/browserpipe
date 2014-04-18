var util = require('./util');

var detectEncoding = require('detect-encoding');

var Promise = require('bluebird');

var HTML_BEGINING_MAX_LENGTH = 5000;
//by w3c recommendation charset should appear in first 1024 bytes, but of course site makers are more clever

var HTML5_META_CHARSET_RE = /<meta\s+charset=(?:'|")([a-zA-Z0-9_-]+)(?:'|")\s*\/?>/i;

var HTML4_META_HTTP_EQUIV_RE1 = /<meta\s+http-equiv=(?:"|')Content-Type(?:"|')\s+content=(?:"|').+charset=([a-zA-Z0-9_-]+)(?:"|')\s*\/?>/i;
var HTML4_META_HTTP_EQUIV_RE2 = /<meta\s+content=(?:"|').+charset=([a-zA-Z0-9_-]+)(?:"|')\s+http-equiv=(?:"|')Content-Type(?:"|')\s*\/?>/i;


function htmlCharset(buffer) {
  var begining = buffer.toString('ascii', 0, HTML_BEGINING_MAX_LENGTH);

  //first try to find html5 <meta charset="...">
  var html5charset = begining.match(HTML5_META_CHARSET_RE);
  if (html5charset) {
    return html5charset[1];
  }

  var html4charset = begining.match(HTML4_META_HTTP_EQUIV_RE1);
  if (html4charset) {
    return html4charset[1];
  }

  html4charset = begining.match(HTML4_META_HTTP_EQUIV_RE2);
  if (html4charset) {
    return html4charset[1];
  }
}

exports.htmlCharset = htmlCharset;

var CSS_BEGINING_MAX_LENGTH = 1024; //maybe it is too many =)

function cssCharset(buffer) {
  var begining = buffer.toString('ascii', 0, CSS_BEGINING_MAX_LENGTH);
  return util.extractStyleCharset(begining);
}

exports.cssCharset = cssCharset;

exports.guessCharset = function (buffer) {
  return new Promise(function(resolve, reject) {
    detectEncoding(buffer, function (err, result) {
      if (err) return reject(err);

      resolve(result);
    });
  })
};