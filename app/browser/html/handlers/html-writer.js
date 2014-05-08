var entities = require("entities");

var Base = require('./base');
var util = require('../../util');

var Promise = require('bluebird');
var file = require('../../../../util/file');
var contentType = require('../../../../util/content-type');

var cssProcess = require('./css').process;


var HtmlWriteHandler = function() {

  this.styleChunks = [];
  this.imgChunks = [];

  this.currentStyleChunk = '';
  this.currentImgChunk = '';

  this.hasDoctype = false;

  this.stylesheetsDownloads = [];
  this.stylesheetsAttributes = [];

  //before doctype we can remove whitespace
  this.removeExtraWhiteSpace = true;

  Base.apply(this, arguments);
};

HtmlWriteHandler.prototype = Object.create(Base.prototype);

function processCss(css, attributes, browser) {
  return Promise.all(css).then(function(datas) {
    return Promise.all(datas.map(function(body, index) {
      return cssProcess(body, attributes[index], browser);
    }))
  })
    .then(function(allContentChunked) {
      return allContentChunked.join('');
    })
    .then(function(allContent) {
      return [util.saveData(allContent, '.css', browser.item), allContent];
    });
}
// assume we already saved previous version on disk
/*
 This function replaces all urls with download and save
 */
function finalCssProcess(name, text, browser) {
  return Promise.all(util.splitStyleByUrl(text, function(url) {
    if(!util.isHttpURI(url)) {
      return url;
    }

    return browser._loadUrlAndSave(url).then(function(name) {
      var localUrl = file.url(name);
      return localUrl;
    })

  })).then(function(chunks) {
    //console.log(chunks);
    return util.saveDataByName(chunks.join(''), name);
  })
}

HtmlWriteHandler.prototype.gather = function(obj) {
  var that = this;
  this.resetStyleChunk();
  this.resetImgChunk();

  var sheet = processCss(this.stylesheetsDownloads, this.stylesheetsAttributes, this.browser);

  //save sheet as <link>
  var stylesheets = sheet.spread(function(sheetName) {
    var linkHtml = util.openTag('link', { type: contentType.CSS.toString(), rel: 'stylesheet', href: file.url(sheetName) });

    return linkHtml;
  });

  var processedStylesheetPromise = sheet.spread(function(name, content) {
    return finalCssProcess(name, content, that.browser);
  });

  this.imgChunks[this.cssMarkerImgIndex] = stylesheets;
  this.styleChunks[this.cssMarkerStyleIndex] = stylesheets;

  obj.contentPromise = Promise.all(this.styleChunks).then(function(chunks) { return chunks.join(''); });

  obj.contentPromiseWithImages =  processedStylesheetPromise.then(function() { //with second content it will be all uber content with download everything
    return Promise.all(that.imgChunks).then(function(chunks) {
      return chunks.join('');
    });
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

// check if this is stylesheet that we can download
function isStylesheet(name, attributes) {
  return name == 'link' &&
    attributes.href &&
    util.isHttpURI(attributes.href) &&
    (attributes.rel && attributes.rel.toLowerCase() == 'stylesheet') &&
    (attributes.type && attributes.type.toLowerCase().indexOf('text/css') >= 0);
}

// check if this is image that we can download
function isImage(name, attributes) {
  return name == 'img' &&
    attributes.src &&
    util.isHttpURI(attributes.src);
}

function isHtml5MetaCharset(name, attributes) {
  return name == 'meta' &&
    attributes.charset;
}

function isHtml4MetaCharset(name, attributes) {
  return name == 'meta' &&
    (attributes['http-equiv'] && attributes['http-equiv'].toLowerCase() == 'content-type');
}

function isStyle(name, attributes) {
  return name == 'style';
}


HtmlWriteHandler.prototype.onOpenTag = function(name, attributes) {
  this.addDoctype();
  var that = this;

  if(name == 'body' || name == 'script' || name == 'style') {
    this.removeExtraWhiteSpace = false;
  }

  if(isStylesheet(name, attributes)) {
    this.stylesheetsDownloads.push(this.browser._loadUrlOnly(entities.decodeHTML(attributes.href)));
    this.stylesheetsAttributes.push(attributes);
  } else if(isImage(name, attributes)) {
    this.resetImgChunk();//flush everything before

    //add <img> tag via promise
    this.imgChunks.push(this.browser._loadUrlAndSave(entities.decodeHTML(attributes.src))
      .then(function(name) {
        attributes.src = file.url(name);
        return util.openTag('img', attributes);
      }));
    //for first version we load it as is
    this.addStyle(util.openTag(name, attributes, false));
  } else if(isHtml5MetaCharset(name, attributes) || isHtml4MetaCharset(name, attributes)) {
    //we just skip page included <meta> for setting charset
  } else if(isStyle(name)) {
    this.inStyle = true;
  } else {
    this.add(util.openTag(name, attributes, false));//TODO check what if inside attribute will be quote? Probably will be need to unescape and escape eveything

    // immediatly after open <head> we add meta charset
    if(name == 'head') {
      this.addMetaCharset();
    }
  }
};


HtmlWriteHandler.prototype.onText = function(textObj) {
  if(this.removeExtraWhiteSpace) {
    this.add(textObj.text.replace(/\s+/g, ' '));
  } else if(this.inStyle) {
    this.resetStyleChunk();
    this.resetImgChunk();

    var styleTag = cssProcess({ content: textObj.text, href: this.url }, {}, this.browser).then(function(content) {
      return '<style>' + content + '</style>';
    });

    this.imgChunks.push(styleTag);
    this.styleChunks.push(styleTag);
  } else {
    this.add(textObj.text);
  }
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

    var cssMarker = Promise.cast('');

    this.cssMarkerImgIndex = this.imgChunks.length;
    this.cssMarkerStyleIndex = this.styleChunks.length;

    this.imgChunks.push(cssMarker);
    this.styleChunks.push(cssMarker);
  }

  if(util.voidElements[name]) {
    //do nothing as it is html5
  } else {
    this.add('</' + name + '>');
  }

  if(name == 'script' || name == 'style' || name == 'body') {
    this.removeExtraWhiteSpace = true;
  }

  if(isStyle(name)) {
    this.inStyle = false;
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

HtmlWriteHandler.prototype.addMetaCharset = function() {
  this.add('<meta charset="utf-8">');
};

module.exports = HtmlWriteHandler;
