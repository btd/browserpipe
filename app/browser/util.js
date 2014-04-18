var contentType = require('../../util/content-type');
var file = require('../../util/file');

var url = require('url');

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
};

function saveData(data, ct) {
    return file.saveData(data, contentType.resolveExtension(ct.type));
}

exports.saveData = saveData;

exports.saveDataByName = file.saveDataByName;


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

exports.makeUrlReplacer = makeUrlReplacer;

function unQuote(text) {
    if(text[0] == '"' && text[text.length - 1] == '"') return text.substring(1, text.length - 1);
    if(text[0] == "'" && text[text.length - 1] == "'") return text.substring(1, text.length - 1);
    return text;
}

exports.unQuote = unQuote;

var URL_RE = /url\(([^)]+)\)/g;
var IMPORT_URL_RE = /@import\s+url\(([^)]+)\);/g;

function replaceStyleUrl(style, replace) {
    return style.replace(URL_RE, function(_, url) {
        return 'url(' + replace(unQuote(url)) + ')';
    });
}

exports.replaceStyleUrl = replaceStyleUrl;

function makeRegexSplitter(regex) {
  return function (text, callback) {
    var chunks = [];
    var index = 0;
    text.replace(regex, function () {
      var args = arguments, match = args[0], offset = args[args.length - 1];

      chunks.push(text.slice(index, offset));

      callback(chunks, args);

      index = offset + match.length;
      return  match;
    });

    chunks.push(text.slice(index, text.length));

    return chunks;
  }
}

var styleUrlSplitter = makeRegexSplitter(URL_RE);

exports.splitStyleByUrl = function(text, replace) {
  return styleUrlSplitter(text, function(chunks, args) {
    var url = args[1];

    chunks.push('url(');
    chunks.push(replace(unQuote(url)));
    chunks.push(')');
  })
};

var styleImportSplitter = makeRegexSplitter(IMPORT_URL_RE);

exports.splitStyleByImport = function(text, replace) {
  return styleImportSplitter(text, function(chunks, args) {
    var url = args[1];

    chunks.push(replace(unQuote(url)));
  })
};

var CSS_CHARSET_RE = /^\s*@charset\s+([\w\'\"-]+);/;

exports.extractStyleCharset = function(text) {
  var encoding;
  text.replace(CSS_CHARSET_RE, function(_, e) {
    encoding = unQuote(e);
    return '';
  });
  return encoding;
};

exports.removeStyleCharset = function(text) {
  return text.replace(CSS_CHARSET_RE, '');
};

var DATAURI_RE = /^data:/i;

exports.isDataURI = function(url) {
  return DATAURI_RE.test(url);
}

