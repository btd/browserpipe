var logger = require('rufus').getLogger('app.browser');

var request = require('request'),
  HtmlProcessor = require("./html/parser").HtmlProcessor;

var textToHtml = require('./viewer/code');
var imgToHtml = require('./viewer/img');

var contentType = require('../../util/content-type');
var file = require('../../util/file');

var Promise = require('bluebird');

var getCharset = require('http-buffer-charset');
var Iconv = require('iconv').Iconv;

var util = require('./util');
var charsetDetector = require('./charset-detector');

function Browser(langs) {
  this.htmlProcessor = new HtmlProcessor(this);
  this.langs = langs;

  //TODO make browser caching for css sprites to do not redownload them
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


// this method should convert body buffer to utf-8
Browser.prototype.bodyToString = function (charset, body) {
  if (charset) {
    var bufferCharset = getCharset(charset);
    if (!bufferCharset) {
      var iconv = new Iconv(getCharset.resolveAliasCharset(charset), 'UTF-8');
      return iconv.convert(body);
    }
    return body.toString(bufferCharset);
  } else {
    return body.toString();
  }
}

//TODO split this method
Browser.prototype.processPage = function (url, isMainUrl) {
  var that = this;
  return new Promise(function (resolve, reject) {
    request({
      url: url,
      headers: {
        // we are a fresh firefox
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0',
        'Accept-Language': that.langs
      },
      encoding: null // set body to buffer
    }, function (error, response, _body) {
      if (error) return reject(error);

      if (response.statusCode === 200) {
        logger.debug('Requested url %s status code %d', url, response.statusCode);

        // first try to get content-type and charset from Content-Type header
        var ct = response.headers['content-type'] && contentType.process(response.headers['content-type']);

        logger.debug('Url %s content type from header %s', url, ct);

        if (ct) {//we have content type
          if (!ct.hasCharset() && !contentType.isBinary(ct.type)) {//but do not have charset
            if (contentType.isHtml(ct.type)) {
              //fill from <meta>
              ct.charset = charsetDetector.htmlCharset(_body);
            } else if (contentType.isCss(ct.type)) {
              //fill from @charset
              ct.charset = charsetDetector.cssCharset(_body);
              //fallback to "UTF-8"
              if (!ct.hasCharset()) {
                ct.charset = 'utf-8';
              }
            }

            logger.debug('Url %s content type from body %s', url, ct);

            if (!ct.hasCharset() && !contentType.isBinary(ct.type)) {// if we could not get from source
              //fill from libmagic
              var promisedContentType = charsetDetector.guessCharset(_body).then(function (encoding) {
                logger.debug('Url %s content type from magic %s', url, ct);
                ct.charset = encoding;
                return ct;
              });
            }
          }
        } else {
          // try to get from libmagic content-type and encoding
          var promisedContentType = contentType.guessContentTypeMagically(_body).then(function (contentType) {
            if (contentType.isBinary(contentType)) {
              return contentType.process(contentType);
            } else {
              return charsetDetector.guessCharset(_body).then(function (encoding) {
                return new contentType.ContentType(contentType, encoding);
              })
            }
          });
        }

        return Promise.cast(promisedContentType).then(function (ct2) {
          if (ct2) {
            ct = ct2;
            logger.debug('Url %s content type from magic and icu %s', url, ct);
          }

          logger.debug('Url %s content type finally %s', url, ct);
          var body = contentType.isBinary(ct.type) ? _body : that.bodyToString(ct.charset, _body);

          // main url means that user request this url
          if (isMainUrl) {
            if (contentType.isHtml(ct.type)) {
              return that.processHtml(url, body, ct).then(resolve);
            } else if (contentType.isImage(ct.type)) {
              var ext = contentType.chooseExtension(url, ct.type);
              return util.saveData(body, ext).then(function (path) {
                ct = contentType.HTML;

                imgToHtml(file.url(path), function (err, html) {
                  resolve({ content: html, href: response.request.href, contentType: ct });
                });
              });
            } else if (!contentType.isBinary(ct.type)) {
              ct = contentType.HTML;
              textToHtml(body, function (err, html) {
                resolve({ content: html, href: response.request.href, contentType: ct});
              });
            } else {
              //TODO what to do with binary content that don't know what to do?
            }
          } else { // url relative to main url like css on html page
            return resolve({ content: body, href: response.request.href, contentType: ct });
          }
        })
      } else {
        return reject({ msg: response.statusCode + ' response', statusCode: response.statusCode });
      }
    });
  });
};

Browser.prototype.processHtml = function (baseUrl, htmlText, ct) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.htmlProcessor.process(baseUrl, htmlText, function (err, data) {
      if (err) return reject({ msg: err });

      data.href = baseUrl;
      data.contentType = ct;

      return data.contentPromise.then(function (html) {
        data.content = html;
        data.contentNext = data.contentPromiseWithImages;
        return resolve(data);
      });
    });
  });
};

var InvalidUrlError = function (urls) {
  return function (/*e*/) {
    return urls.length > 0
  }
};

Browser.prototype.processNextUrl = function (urls, isMainUrl) {
  var url = urls.shift();
  var that = this;
  return this.processPage(url, isMainUrl)
    .catch(InvalidUrlError(urls), function (/*e*/) {
      return that.processNextUrl(urls, isMainUrl);
    })
};

/**
 Load required url and return promise with processed content
 if type on resolved data presented it will be either html ot css
 */
Browser.prototype._loadUrl = function (url, isMainUrl) {
  var urls = processUrl(url);
  return this.processNextUrl(urls, isMainUrl);
};


module.exports = Browser;
