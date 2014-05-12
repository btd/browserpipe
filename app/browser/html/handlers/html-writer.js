var entities = require("entities");

var Base = require('./base');
var util = require('../../util');

var Promise = require('bluebird');
var file = require('../../../../util/file');
var contentType = require('../../../../util/content-type');

var cssProcess = require('./css').process;


var HtmlWriteHandler = function() {
  this.chunks = [];

  this.currentChunk = '';

  this.hasDoctype = false;

  this.stylesheetsContent = [];
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
    .then(function(text) {
      return Promise.all(util.splitStyleByUrl(text, function(url) {
        if(!util.isHttpURI(url)) {
          return url;
        }

        return browser._loadUrlAndSave(url).then(function(name) {
          var localUrl = file.url(name);
          return localUrl;
        })

      }))
    })
    .then(function(chunks) {
      return browser.saveData(chunks.join(''), '.css');
    });
}


HtmlWriteHandler.prototype.gather = function(obj) {
  var that = this;
  this.resetChunk();

  var sheet = processCss(this.stylesheetsContent, this.stylesheetsAttributes, this.browser);

  //save sheet as <link>
  var stylesheets = sheet.then(function(sheetName) {
    var linkHtml = util.openTag('link', { type: contentType.CSS.toString(), rel: 'stylesheet', href: file.url(sheetName) });

    return linkHtml;
  });

  this.chunks[this.cssMarkerIndex] = stylesheets;

  obj.contentPromise = Promise.all(that.chunks).then(function(chunks) {
    return chunks.join('');
  });
};

HtmlWriteHandler.prototype.resetChunk = function() {
  this.chunks.push(this.currentChunk);
  this.currentChunk = '';
};


HtmlWriteHandler.prototype.add = function(text) {
  this.currentChunk += text;
};

// check if this is stylesheet that we can download
function isStylesheet(name, attributes) {
  return name == 'link' &&
    attributes.href &&
    util.isHttpURI(attributes.href) &&
    (attributes.rel && attributes.rel.toLowerCase() == 'stylesheet')/* &&
    (attributes.type && attributes.type.toLowerCase().indexOf('text/css') >= 0)*/; 
    //TODO when download css we need to check content-type by idea
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
    this.stylesheetsContent.push(this.browser._loadUrlOnly(entities.decodeHTML(attributes.href)));
    this.stylesheetsAttributes.push(attributes);
  } else if(isImage(name, attributes)) {
    this.resetChunk();//flush everything before

    //add <img> tag via promise
    this.chunks.push(this.browser._loadUrlAndSave(entities.decodeHTML(attributes.src))
      .then(function(name) {
        attributes.src = file.url(name);
        return util.openTag('img', attributes);
      }));
  } else if(isHtml5MetaCharset(name, attributes) || isHtml4MetaCharset(name, attributes)) {
    //we just skip page included <meta> for setting charset
  } else if(isStyle(name)) {
    this.inStyle = true;
    
    attributes.href = this.url;
    this.stylesheetsAttributes.push(attributes);
  } else {
    this.add(util.openTag(name, attributes, false));
    //TODO check what if inside attribute will be quote? Probably will be need to unescape and escape eveything

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
    this.stylesheetsContent.push(Promise.cast({
      content: textObj.text,
      contentType: contentType.CSS,
      href: this.url
    }));
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
    this.resetChunk();

    var cssMarker = Promise.cast('');

    this.cssMarkerIndex = this.chunks.length;

    this.chunks.push(cssMarker);
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
