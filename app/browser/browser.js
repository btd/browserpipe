var request = require('request');
var HtmlProcessor = require("./parser/parser").HtmlProcessor;

var Promise = require('bluebird');


function Browser() {
  this.htmlProcessor = new HtmlProcessor(this);
}

//If it cannot make a URL out of it, it searchs term in Google
function processURL(url) {
  //TODO improve regex to also accept data uris and urls that do not start with http or https
  if(url.match(/^https?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/))
    return url;
  else {
    /* TODO
     We can load only for now http + https content (and proce ss only html)
     But even with this regexp above restrinct on fully valid urls like
     http://mongoosejs.com/docs/api.html#promise-js
     */
    return url; // TODO think about it more
    //return "http://www.google.com/search?q=" + encodeURIComponent(url);
  }
}

function htmlContentType(m) {
  return m.indexOf('text/html') >= 0 || m.indexOf('application/xhtml+xml') >= 0 || m.indexOf('application/xml') >= 0;
}

function cssContentType(m) {
  return m.indexOf('text/css') >= 0;
}

/**
  Load required url and return promise with processed content
 if type on resolved data presented it will be either html ot css
 */
Browser.prototype._loadUrl = function(url) {
  var that = this;

  return new Promise(function(resolve, reject) {
    request({
      url: processURL(url),
      headers: {
        // we are a fresh firefox
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0'
      }
    }, function(error, response, body) {
      if(error) return reject(error);

      if(response.statusCode === 200) {
        var contentType = response.headers['content-type'];
        if(htmlContentType(contentType)) {
          that.htmlProcessor.process(url, body, function(err, data) {
            if(err) return reject(err);

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
        return reject(new Error('Not a 200 status code, but ' + response.statusCode));
      }
    });
  });
};

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
