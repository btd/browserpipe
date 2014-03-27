var request = require('request'),
  parser = require("./parser/parser"),
  HtmlProcessor = parser.HtmlProcessor;

var textToHtml = require('./viewer/code');
var imgToHtml = require('./viewer/img');

var contentType = require('../../util/content-type');

var Promise = require('bluebird');

var getCharset = require('http-buffer-charset');
var Iconv = require('iconv').Iconv;


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

function bodyToString(charset, body) {
  if(charset) {
    var bufferCharset = getCharset(charset);
    if(!bufferCharset) {
      var iconv = new Iconv(getCharset.resolveAliasCharset(charset), 'UTF-8');
      return iconv.convert(body);
    }
    return body.toString(bufferCharset);
  } else {
    return body.toString();
  }
}

Browser.prototype.processPage = function(url, isMainUrl) {

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

      var ct = contentType.process(response.headers['content-type']);
      var baseType = contentType.resolveType(ct.type);
      var body = contentType.isBinary(ct.type) ? _body: bodyToString(ct.charset, _body);

      if(response.statusCode === 200) {

        // main url means that user request this url
        if(isMainUrl) {
          switch(baseType) {
            case 'html':
              that.htmlProcessor.process(url, body, function(err, data) {
                if(err) return reject({ msg: err });

                data.type = 'html';// type i assume that it is like enumeration with basic types html, image, css, script etc - so no specific
                data.headers = response.headers;
                data.href = response.request.href;

                return resolve(data);
              });
              break;

            case 'img':
              ct.type = 'text/html';
              response.headers['content-type'] = ct.toString();
              imgToHtml(body, function(err, html) {//TODO we need to save image first
                resolve({ content: html, type: 'html', headers: response.headers, href: response.request.href});
              });

            default:
              ct.type = 'text/html';
              response.headers['content-type'] = ct.toString();
              textToHtml(body, function(err, html) {
                resolve({ content: html, type: 'html', headers: response.headers, href: response.request.href});
              });
          }
        } else { // url relative to main url like css on html page
          return resolve({ content: body, type: baseType, headers: response.headers, href: response.request.href });
        }

      } else {
        return reject({ msg: response.statusCode + ' response', statusCode: response.statusCode });
      }
    });
  });
};

var InvalidUrlError = function(urls) {
  return function(e) {
    return urls.length > 0
  }
}

Browser.prototype.processNextUrl = function(urls, isMainUrl) {
  var url = urls.shift();
  var that = this;
  return this.processPage(url, isMainUrl)
    .catch(InvalidUrlError(urls), function(e) {
      return this.processNextUrl(urls, isMainUrl);
    })
}

/**
 Load required url and return promise with processed content
 if type on resolved data presented it will be either html ot css
 */
Browser.prototype._loadUrl = function(url, isMainUrl) {
  var urls = processUrl(url);
  return this.processNextUrl(urls, isMainUrl);
}

var voidElements = require('./parser/handlers/html-writer').voidElements;

Browser.tag = function(name, attributes) {
  var text = '';
  text += '<' + name;
  for(var attr in attributes) {
    // it does not un escape entities
    text += ' ' + attr + '="' + attributes[attr] + '"';
  }
  text += '>';
  if(voidElements[name]) {}
  else text += '</' + name + '>';
  return text;
}

module.exports = Browser;
