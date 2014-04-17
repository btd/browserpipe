var Base = require('./base');
var util = require('../../util');

var Promise = require('bluebird');
var file = require('../../../../util/file');
var contentType = require('../../../../util/content-type');

var cssProcess = require('./css').process;


var HtmlWriteHandler = function () {

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
  return Promise.all(css).then(function (datas) {
    return Promise.all(datas.map(function (body, index) {
      return cssProcess(body, attributes[index], browser);
    }))
  })
    .then(function (allContentChunked) {
      return allContentChunked.join('');
    })
    .then(function (allContent) {
      return [util.saveData(allContent, contentType.CSS), allContent];
    });
}
// assume we already saved previous version on disk
/*
This function replaces all urls with download and save
 */
function finalCssProcess(name, text, browser) {
  return Promise.all(util.splitStyleByUrl(text, function (url) {//TODO skip datauri
    return browser._loadUrl(url)
      .then(function (data) {
        return util.saveData(data.content, data.contentType);
      })
      .then(function (name) {
        return file.url(name);
      })
  })).then(function (chunks) {
    return util.saveDataByName(chunks.join(''), name);
  })
}

HtmlWriteHandler.prototype.gather = function (obj) {
  var that = this;
  this.resetStyleChunk();
  this.resetImgChunk();

  var sheet = processCss(this.stylesheetsDownloads, this.stylesheetsAttributes, this.browser);

  //save sheet as <link>
  var stylesheets = sheet.spread(function (sheetName) {
    var linkHtml = util.openTag('link', { type: contentType.CSS.toString(), rel: 'stylesheet', href: file.url(sheetName) });

    return linkHtml;
  });

  var processedStylesheetPromise = sheet.spread(function (name, content) {
    return finalCssProcess(name, content, that.browser);
  });

  obj.contentPromise = stylesheets.then(function (link) {
    return that.styleChunks[0] + link + that.styleChunks[1];
  });

  obj.contentPromiseWithImages = stylesheets.then(function (link) {
    that.imgChunks[0] += link;
    return processedStylesheetPromise.then(function () { //with second content it will be all uber content with download everything
      return Promise.all(that.imgChunks).then(function (chunks) {
        return chunks.join('');
      });
    });
  });
};

HtmlWriteHandler.prototype.resetImgChunk = function () {
  this.imgChunks.push(this.currentImgChunk);
  this.currentImgChunk = '';
};

HtmlWriteHandler.prototype.resetStyleChunk = function () {
  this.styleChunks.push(this.currentStyleChunk);
  this.currentStyleChunk = '';
};

HtmlWriteHandler.prototype.add = function (text) {
  this.addImg(text);
  this.addStyle(text);
};

HtmlWriteHandler.prototype.addImg = function (text) {
  this.currentImgChunk += text;
};

HtmlWriteHandler.prototype.addStyle = function (text) {
  this.currentStyleChunk += text;
};

function isStylesheet(name, attributes) {
  return name == 'link' && attributes.rel == 'stylesheet' && ((attributes.type && attributes.type == 'text/css') || !attributes.type) && attributes.href;
}

HtmlWriteHandler.prototype.onOpenTag = function (name, attributes) {
  this.addDoctype();

  if (name == 'body' || name == 'script' || name == 'style') {
    this.removeExtraWhiteSpace = false;
  }

  if (isStylesheet(name, attributes)) {
    this.stylesheetsDownloads.push(this.browser._loadUrl(attributes.href));
    this.stylesheetsAttributes.push(attributes);
  } else {
    if (name == 'img') {
      this.resetImgChunk();//flush everything before

      //add <img> tag via promise
      this.imgChunks.push(this.browser._loadUrl(attributes.src)
        .then(function (data) {//TODO check on datauri
          return util.saveData(data.content, data.contentType);
        })
        .then(function (name) {
          attributes.src = file.url(name);
          return util.openTag('img', attributes);
        }));
      //for first version we load it as is
      this.addStyle(util.openTag(name, attributes, false));
    } else {
      this.add(util.openTag(name, attributes, false));//TODO check what if inside attribute will be quote? Probably will be need to unescape and escape eveything
    }
  }
};


HtmlWriteHandler.prototype.onText = function (textObj) {
  if (this.removeExtraWhiteSpace)
    this.add(textObj.text.replace(/\s+/g, ' '));
  else
    this.add(textObj.text);
};


HtmlWriteHandler.prototype.onCloseTag = function (name) {
  if (name == 'head') {
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

  if (util.voidElements[name]) {
    //do nothing as it is html5
  } else {
    this.add('</' + name + '>');
  }

  if (name == 'script' || name == 'style' || name == 'body') {
    this.removeExtraWhiteSpace = true;
  }
};

HtmlWriteHandler.prototype.onProcessingInstruction = function (name, value) {
  if (name == '!doctype') {
    //we will rewrite previous html with new doctype and assume it is html5 always
    //TODO test this for xml+xhtml for XML <?xml ...>
    this.addDoctype();
  }
};

HtmlWriteHandler.prototype.addDoctype = function () {
  if (!this.hasDoctype) {
    this.add('<!doctype html>');
    this.hasDoctype = true;
  }
};

module.exports = HtmlWriteHandler;