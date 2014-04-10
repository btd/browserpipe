var request = require('request'),
  parser = require("./parser/parser"),
  HtmlProcessor = parser.HtmlProcessor;

var textToHtml = require('./viewer/code');
var imgToHtml = require('./viewer/img');

var contentType = require('../../util/content-type');
var file = require('../../util/file');

var Promise = require('bluebird');

var getCharset = require('http-buffer-charset');
var Iconv = require('iconv').Iconv;

function saveData(data, ct) {
  return file.saveData(data, contentType.resolveExtension(ct.type));
}

function Browser(langs) {
  this.htmlProcessor = new HtmlProcessor(this);
  this.langs = langs;
}

Browser.save = saveData;

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

Browser.prototype.bodyToString = function(charset, body) {
  if(charset) {
    var bufferCharset = getCharset(charset);
    if(!bufferCharset) {
      var iconv = new Iconv(getCharset.resolveAliasCharset(charset), 'UTF-8');
      return iconv.convert(body);
    }
    return body.toString(bufferCharset);
  } else {
    return body.toString();//TODO need to add in some way check on default encoding (which is latin-1)
  }
}
//TODO try to parse buffer begining to find <meta> with charset



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

      var ct = response.headers['content-type'] ?
        contentType.process(response.headers['content-type']) :
        contentType.guessByUrl(response.request.href);//TODO is any other way? not touching content

      var baseType = contentType.resolveType(ct.type);

      if(response.statusCode === 200) {
        var body = contentType.isBinary(ct.type) ? _body : that.bodyToString(ct.charset, _body);

        // main url means that user request this url
        if(isMainUrl) {
          switch(baseType) {
            case 'html':
              return that.processHtml(url, body, ct).then(resolve);
            case 'img':
              return saveData(body, ct).then(function(path) {
                ct.type = 'text/html';
                response.headers['content-type'] = ct.toString();

                imgToHtml(file.url(path), function(err, html) {
                  resolve({ content: html, type: 'html', href: response.request.href, contentType: ct });
                });
              });
            default:
              ct.type = 'text/html';
              response.headers['content-type'] = ct.toString();
              textToHtml(body, function(err, html) {
                resolve({ content: html, type: 'html', href: response.request.href, contentType: ct});
              });
          }
        } else { // url relative to main url like css on html page
          return resolve({ content: body, type: baseType, href: response.request.href, contentType: ct });
        }

      } else {
        return reject({ msg: response.statusCode + ' response', statusCode: response.statusCode });
      }
    });
  });
};

Browser.prototype.processHtml = function(baseUrl, htmlText, ct) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.htmlProcessor.process(baseUrl, htmlText, function(err, data) {
      if(err) return reject({ msg: err });

      data.type = 'html';
      data.href = baseUrl;
      data.contentType = ct;

      return data.contentPromise.then(function(html) {
        data.content = html;
        data.contentNext = data.contentPromiseWithImages;
        return resolve(data);
      });
    });
  });
};

var InvalidUrlError = function(urls) {
  return function(e) {
    return urls.length > 0
  }
};

Browser.prototype.processNextUrl = function(urls, isMainUrl) {
  var url = urls.shift();
  var that = this;
  return this.processPage(url, isMainUrl)
    .catch(InvalidUrlError(urls), function(e) {
      return that.processNextUrl(urls, isMainUrl);
    })
};

/**
 Load required url and return promise with processed content
 if type on resolved data presented it will be either html ot css
 */
Browser.prototype._loadUrl = function(url, isMainUrl) {
  var urls = processUrl(url);
  return this.processNextUrl(urls, isMainUrl);
};


module.exports = Browser;
