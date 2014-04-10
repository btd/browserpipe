var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
  reUnescapedHtml = /[&<>"']/g;

var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};


var htmlUnescapes = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'"
};

//http://www.w3.org/TR/html5/syntax.html#void-elements
// this tag should not be closed
var voidElements = {
  area: true,
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
  wbr: true
};

exports.voidElements = voidElements;

function escapeHtmlChar(chr) {
  return htmlEscapes[chr];
}

function unescapeHtmlChar(chr) {
  return htmlUnescapes[chr];
}

function escape(string) {
  return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
}

function unescape(string) {
  if (string == null) {
    return '';
  }
  string = String(string);
  return string.indexOf(';') < 0 ? string : string.replace(reEscapedHtml, unescapeHtmlChar);
}

exports.escape = escape;
exports.unescape = unescape;

function id(a) { return a }

exports.tag = function(name, attributes, escapeAttributes) {
  var escapeFunc = escapeAttributes ? escape : id;
  var text = '';
  text += '<' + name;
  Object.keys(attributes).forEach(function(attr) {
    text += ' ' + attr + '="' + escapeFunc(attributes[attr]) + '"';
  });
  text += '>';
  if(voidElements[name]) {}
  else text += '</' + name + '>';
  return text;
};

exports.openTag = function(name, attributes, escapeAttributes) {
  var escapeFunc = escapeAttributes ? escape : id;
  var text = '';
  text += '<' + name;
  Object.keys(attributes).forEach(function(attr) {
    text += ' ' + attr + '="' + escapeFunc(attributes[attr]) + '"';
  });
  text += '>';
  return text;
}

