var Base = require('./base');
var browserUtil = require('../../util');

var Promise = require('bluebird');

var util = require('../../util');
var file = require('../../../../util/file');
var contentType = require('../../../../util/content-type');

var absUrl = require('./abs-url');

var HtmlWriteHandler = function() {

  this.styleChunks = [];
  this.imgChunks = [];

  this.currentStyleChunk = '';
  this.currentImgChunk = '';

  this.resetChunk = false;

  this.hasDoctype = false;

  this.stylesheetsDownloads = [];
  this.stylesheetsAttributes = [];

  //before doctype we can remove whitespace
  this.removeExtraWhiteSpace = true;

  Base.apply(this, arguments);
};

HtmlWriteHandler.prototype = Object.create(Base.prototype);

function processCss(css, attributes) {
//TODO remove @charset inside
  return Promise.all(css).then(function(datas) {
    var allContent = '';

    datas.forEach(function(body, index) {
      var attr = attributes[index];
      var media = attr.media || 'all';

      var content = absUrl.replaceStyleUrl(body.content, absUrl.makeUrlReplacer(body.href));

      if(media && media != 'all') {
        allContent += '@media ' + media + ' { ' + content + '} '; //TODO is it possible to have nested media queries?
      } else {
        allContent += content;
      }
    });

    return util.saveData(allContent, contentType.CSS);
  });
}

HtmlWriteHandler.prototype.gather = function(obj) {
  var that = this;
  this.resetStyleChunk();
  this.resetImgChunk();

  var stylesheets = processCss(this.stylesheetsDownloads, this.stylesheetsAttributes).then(function(sheetName) {
    var linkHtml = browserUtil.openTag('link', { type: contentType.CSS.toString(), rel: 'stylesheet', href: file.url(sheetName) });

    return linkHtml;
  });

  obj.contentPromise = stylesheets.then(function(link) {
    return that.styleChunks[0] + link + that.styleChunks[1];
  });

  obj.contentPromiseWithImages = stylesheets.then(function(link) {
    that.imgChunks[0] += link;
    return Promise.all(that.imgChunks).then(function(chunks) {
      return chunks.join('');
    })
  });
};

HtmlWriteHandler.prototype.resetImgChunk = function() {
  this.imgChunks.push(this.currentImgChunk);
  this.currentImgChunk = '';
};

HtmlWriteHandler.prototype.resetStyleChunk = function() {
  this.styleChunks.push(this.currentStyleChunk);
  this.currentStyleChunk = '';
};

HtmlWriteHandler.prototype.add = function(text) {
  this.addImg(text);
  this.addStyle(text);
};

HtmlWriteHandler.prototype.addImg = function(text) {
  this.currentImgChunk += text;
};

HtmlWriteHandler.prototype.addStyle = function(text) {
  this.currentStyleChunk += text;
};

function isStylesheet(name, attributes) {
  return name == 'link' && attributes.rel == 'stylesheet' && ((attributes.type && attributes.type == 'text/css') || !attributes.type) && attributes.href;
}

HtmlWriteHandler.prototype.onOpenTag = function(name, attributes) {
  this.addDoctype();

  if(name == 'body' || name == 'script' || name == 'style') {
    this.removeExtraWhiteSpace = false;
  }

  if(isStylesheet(name, attributes)) {
    this.stylesheetsDownloads.push(this.browser._loadUrl(attributes.href));
    this.stylesheetsAttributes.push(attributes);
  } else {
    if(name == 'img') {
      this.resetImgChunk();//flush everything before

      //add <img> tag via promise
      this.imgChunks.push(this.browser._loadUrl(attributes.src)
        .then(function(data) {//TODO check on datauri
          return util.saveData(data.content, data.contentType);
        })
        .then(function(name) {
          attributes.src = file.url(name);
          return browserUtil.openTag('img', attributes);
        }));
      //for first version we load it as is
      this.addStyle(browserUtil.openTag(name, attributes, false));
    } else {
      this.add(browserUtil.openTag(name, attributes, false));//TODO check what if inside attribute will be quote? Probably will be need to unescape and escape eveything
    }
  }
};


HtmlWriteHandler.prototype.onText = function(textObj) {
  if(this.removeExtraWhiteSpace)
    this.add(textObj.text.replace(/\s+/g, ' '));
  else
    this.add(textObj.text);
};


HtmlWriteHandler.prototype.onCloseTag = function(name) {
  if(name == 'head') {
    /*
     i want that
     <html>
     <head>
     ...
     <- this place was the end
     </head>
     <body>
     */
    this.resetStyleChunk();
    this.resetImgChunk();
  }

  if(browserUtil.voidElements[name]) {
    //do nothing as it is html5
  } else {
    this.add('</' + name + '>');
  }

  if(name == 'script' || name == 'style' || name == 'body') {
    this.removeExtraWhiteSpace = true;
  }
};

HtmlWriteHandler.prototype.onProcessingInstruction = function(name, value) {
  if(name == '!doctype') {
    //we will rewrite previous html with new doctype and assume it is html5 always
    //TODO test this for xml+xhtml for XML <?xml ...>
    this.addDoctype();
  }
};

HtmlWriteHandler.prototype.addDoctype = function() {
  if(!this.hasDoctype) {
    this.add('<!doctype html>');
    this.hasDoctype = true;
  }
};

module.exports = HtmlWriteHandler;