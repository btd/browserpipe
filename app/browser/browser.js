var logger = require('rufus').getLogger('app.browser');

var HtmlProcessor = require("./html/parser").HtmlProcessor;

var textToHtml = require('./viewer/code');
var imgToHtml = require('./viewer/img');

var contentType = require('../../util/content-type');
var file = require('../../util/file');

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

var getCharset = require('http-buffer-charset');
var Iconv = require('iconv').Iconv;

var util = require('./util');
var charsetDetector = require('./charset-detector');

var gunzip = Promise.promisify(require('zlib').gunzip);

var screenshot = require('./screenshot/screenshot');

function Browser(langs) {
  this.htmlProcessor = new HtmlProcessor(this);
  this.langs = langs;
  this.files = [];

  this._cache = {};
}


Browser.prototype.saveData = function (data, ext) {
  var that = this;

  return util.saveData(data, ext)
    .then(function (name) {
      var size = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data);
      that.files.push({ name: name, size: size });
      return name;
    });
};


// this method should convert body buffer to utf-8
Browser.prototype.bodyToString = function (charset, body) {
  if (charset && charset.toLowerCase() != 'utf-8') {
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

Browser.prototype.determineContentType = function (response, _body) {
  var ct = response.headers['content-type'] && contentType.process(response.headers['content-type']);
  var url = response.request.href;

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

      if (!ct.hasCharset() && !contentType.isBinary(ct.type) && _body.length > 0) {// if we could not get from source
        //fill from libmagic
        return charsetDetector.guessCharset(_body).then(function (encoding) {
          logger.debug('Url %s content type from magic %s', url, ct);
          ct.charset = encoding;
          return ct;
        });
      }
    }
  } else {
    // try to get from libmagic content-type and encoding
    return contentType.guessContentTypeMagically(_body).then(function (type) {
      if (contentType.isBinary(type)) {
        return contentType.process(type);
      } else {
        return charsetDetector.guessCharset(_body).then(function (encoding) {
          return new contentType.ContentType(type, encoding);
        })
      }
    });
  }

  return Promise.resolve(ct);
}

Browser.prototype.ungzipBody = function (response, body) {
  if (response.headers['content-encoding'] == 'gzip') {
    logger.debug('%s url gzipped', response.request.href);
    return gunzip(body);
  } else {
    return Promise.resolve(body);
  }
}

Browser.prototype.processUrl = function (url, isMainUrl) {
  logger.debug('Process url %s', url);
  var that = this;
  return request({
    url: url,
    headers: {
      // we are a fresh firefox
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:29.0) Gecko/20100101 Firefox/29.0',
      'Accept-Language': that.langs,
      'Cache-Control': 'max-age=0',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    },
    encoding: null // set body to buffer
  }).spread(function (response, _body) {
    logger.debug('Recieved %s url response', response.request.href);

    if (response.statusCode === 200) {
      logger.debug('Requested url %s status code %d', url, response.statusCode);

      // first try to get content-type and charset from Content-Type header
      return that.ungzipBody(response, _body).then(function (_body) {
        return Promise.join(that.determineContentType(response, _body), response.request.href, _body);
      })
    } else {
      throw new util.StatusCodeError(response.statusCode);
    }
  }).spread(function (ct, href, _body) {
    logger.debug('Url %s content type %s', url, ct);

    var body = contentType.isBinary(ct.type) ? _body : that.bodyToString(ct.charset, _body);

    // main url means that user request this url
    if (isMainUrl) {
      if (contentType.isHtml(ct.type)) {
        return that.processHtml(url, body, ct);
      } else if (contentType.isImage(ct.type)) {
        var ext = contentType.chooseExtension(url, ct.type);
        return that.saveData(body, ext).then(function (path) {
          var html = imgToHtml(file.url(path));
          return {
            title: util.fileName(href),
            content: html,
            href: href,
            contentType: contentType.HTML,
            favicon: util.googleFavicon(href)
          };
        });
      } else if (!contentType.isBinary(ct.type)) {
        var html = textToHtml(body);
        return { content: html, href: href, contentType: contentType.HTML };
      } else {
        throw new util.UnsupportedContentTypeError(ct);//TODO what to do with binary content that we don't know what to do?
      }
    } else { // url relative to main url like css on html page
      return { content: body, href: href, contentType: ct };
    }
  })

};

Browser.prototype.processHtml = function (baseUrl, htmlText, ct) {
  var that = this;
  return (new Promise(function (resolve, reject) {
    that.htmlProcessor.process(baseUrl, htmlText, function (err, data) {
      if (err) return reject({ msg: err });

      data.href = baseUrl;
      data.contentType = ct;

      resolve(data);
    });
  }))
    .then(function (data) {
      return data.contentPromise
        .then(function (html) {
          data.content = html;
          return data;
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
  return this.processUrl(url, isMainUrl)
    .catch(InvalidUrlError(urls), function (/*e*/) {
      return that.processNextUrl(urls, isMainUrl);
    })
};

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

/**
 Load required url and return promise with processed content
 if type on resolved data presented it will be either html ot css
 */
Browser.prototype._loadUrl = function (url, isMainUrl) {
  var urls = processUrl(url);
  return this.processNextUrl(urls, isMainUrl);
};

// this used only for relative resources like images in html <img> or css url(...)
Browser.prototype._loadUrlAndSave = function (url) {
  var that = this;
  if (that._cache[url]) return that._cache[url];

  var promisedPath = this.processUrl(url).then(function (data) {
    var ext = contentType.chooseExtension(url, data.contentType.type);
    return that.saveData(data.content, ext);
  }).catch(function (e) {//TODO think about it
    if (e.statusCode) {
      return e.statusCode + '?url=' + encodeURIComponent(url);
    }
  });

  that._cache[url] = promisedPath;

  return promisedPath;
};

//used for css when we know 100% url
Browser.prototype._loadUrlOnly = function (url) {
  return this.processUrl(url, false).catch(function (e) {
    if (e.statusCode) {
      return { content: '', href: url, contentType: contentType.OctetStream }; //is it right idea?
    }
  });
}

Browser.prototype.generateScreenshot = function (html) {
  var that = this;
  return new Promise(function (resolve/*, reject*/) {
    //screenshot.generateScreenshot(html, that, function (screenshotData) {
      resolve(/*screenshotData.screenshotSmall || */screenshot.noScreenshotUrl);
    //})
  })
}


module.exports = Browser;
