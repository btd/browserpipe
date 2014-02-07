var _ = require('lodash');

//We can take ideas from https://github.com/fb55/DomHandler/blob/master/index.js

var re_whitespace = /\s+/g;

var defaultOpts = {
  normalizeWhitespace: false //Replace all whitespace with single spaces
};

function Handler(url, callback, options){
  this._callback = callback;
  this._options = options || defaultOpts;
  this.htmlObj = {
    html: ''
  };
  this._url = (url.slice(-1) === "/"? url.substring(0, url.length - 1) : url);
  this.processElement = false;
  this.isTitleElement = false;
  this._done = false;
}

Handler.prototype.onend = function(){
  if(this._done) return;
  this._done = true;
  this._handleCallback(null);
};

Handler.prototype._handleCallback =
Handler.prototype.onerror = function(error){
  this._callback(error, this.htmlObj);
};

Handler.prototype.onopentag = function(name, attribs){
  if(name !=="script"){
    this._openElement(name, attribs);
    this.processElement = true;
    if(name === "title") this.isTitleElement = true;
    else this.isTitleElement = false;
  }
  else this.processElement = false;
};

Handler.prototype.ontext = function(data){
  if(this.processElement){
    if(this._options.normalizeWhitespace)
      data = data.replace(re_whitespace, " ");
    this._addElementText(data);
  }
}

Handler.prototype.onclosetag = function(name){
  if(this.processElement && name !== "script")
    this._closeElement(name);
};

Handler.prototype._openElement = function(name, attribs){
  var self = this;
  this.htmlObj.html += "<" + name;
  var value = ''; 
  var keys = _.keys(attribs);
  _.each(keys, function(key) {
    if(key === "src" || key === "href")
      value = self._urlsToAbsolute(attribs[key]);
    else value = attribs[key];
    self.htmlObj.html += " " + key + "='" + value + "'";
  });
  this.htmlObj.html += ">";
}

Handler.prototype._urlsToAbsolute = function(path){
  var arr = this._url.split("/");
  var protocol = arr[0];
  var domain = arr[0] + "//" + arr[2]; 
  var absURL = /^(https?|data):/i.test(path);
  if (absURL) return path;
  else if (path.indexOf('/') !== 0) // src="images/test.jpg"
    return this._url + "/" + path;
  else if (path.match(/^\/\//)) // src="//server.com/test.jpg"
    return protocol + path;
  else
    return domain + path;
}

Handler.prototype._addElementText = function(text){
  this.htmlObj.html += text;
  if(this.isTitleElement) this.htmlObj.title = text;
}

Handler.prototype._closeElement = function(name){
  this.htmlObj.html += "</" + name + ">";
}

module.exports = Handler;
