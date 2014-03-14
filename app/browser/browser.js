var request = require('request');
var HtmlProcessor = require("./parser/parser").HtmlProcessor;

var Promise = require('bluebird');

var getCharset = require('http-buffer-charset');
var Iconv  = require('iconv').Iconv;

function Browser(langs) {
  this.htmlProcessor = new HtmlProcessor(this);
  this.langs = langs;
}

//If it cannot make a URL out of it, it searchs term in Google
function processUrl(url) {
  //Best way to know if it is valid is to try it (at least for now)
  //Besides it fails fast as it is a DNS check
  return [
    url, 
    'http://' + url, 
    'https://' + url, 
    'http://www.' + url,
    'https://www.' + url,
    'http://www.google.com/search?q=' + encodeURIComponent(url)
  ];
}

function htmlContentType(m) {
  return m.indexOf('text/html') >= 0 || m.indexOf('application/xhtml+xml') >= 0 || m.indexOf('application/xml') >= 0;
}

function cssContentType(m) {
  return m.indexOf('text/css') >= 0;
}

var csLength = 'charset='.length;

function bodyToString(headers, body) {
  var contentType = headers['content-type'].toLowerCase().split(';');
  if(contentType.length > 1) {
    var httpCharset = contentType[1].trim().substr(csLength);
    var bufferCharset = getCharset(httpCharset);
    if(!bufferCharset) {
      var iconv = new Iconv(getCharset.resolveAliasCharset(httpCharset), 'UTF-8');
      return iconv.convert(body);
    }
    return body.toString(bufferCharset);
  } else {
    return body.toString();
  }
}

var processPage = function(url) {

  var that = this;
  return new Promise(function(resolve, reject) {
    request({
      url: url,
      headers: {
        // we are a fresh firefox
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0',
        'Accept-Language': that.langs
      },
      encoding: null // set body to buffer
    }, function(error, response, _body) {
      if(error) return reject(error);

      var body = bodyToString(response.headers, _body);

      if(response.statusCode === 200) {
        var contentType = response.headers['content-type'];
        if(htmlContentType(contentType)) {
          that.htmlProcessor.process(url, body, function(err, data) {
            if(err) return reject({ msg: err });

            data.type = 'html';// type i assume that it is like enumeration with basic types html, image, css, script etc - so no specific
            data.headers = response.headers;
            data.href = response.request.href;

            return resolve(data);
          });
        } else if(cssContentType(contentType)){
          //there i should process css with minification/concatanation etc
          return resolve({ content: body, type: 'css', headers: response.headers, href: response.request.href });
        } else {
          return resolve({ content: body, headers: response.headers, href: response.request.href });
        }
      } else {
        return reject({ msg: response.statusCode + ' response', statusCode: response.statusCode });
      }
    });
  });
};

var ENOTFOUNDError = function (urls) {
  return function (e) {
    return e.code === 'ENOTFOUND' && urls.length > 0
  }
}

var processNextUrl = function(urls) {
  var that = this;
  var url = urls.shift();
  return processPage.call(this, url)
         .catch(ENOTFOUNDError(urls), function(e){
           return processNextUrl.call(that, urls);
         })
}

/**
  Load required url and return promise with processed content
 if type on resolved data presented it will be either html ot css
 */
Browser.prototype._loadUrl = function(url) {  
  var urls = processUrl(url);
  return processNextUrl.call(this, urls);
}

var voidElements = require('./parser/handlers/html-writer').voidElements;

Browser.tag = function(name, attributes, html5) {
  var text = '';
  text += '<' + name;
  for(var attr in attributes) {
    // it does not un escape entities
    text += ' ' + attr + '="' + attributes[attr] + '"';
  }
  text += '>';
  if(html5 && voidElements[name]) {}
  else text += '</' + name + '>';
  return text;
}

module.exports = Browser;
