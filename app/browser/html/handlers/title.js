var entities = require("entities");

var Base = require('./base');

var TitleHandler = function() {
  this.content = '';

  Base.apply(this, arguments);
};

TitleHandler.prototype = Object.create(Base.prototype);

TitleHandler.prototype.gather = function(obj) {
  obj.title = entities.decodeHTML(this.content);
};

TitleHandler.prototype.onOpenTag = function(name, attributes) {
  if(name == 'title') {
    this.isTitle = true;
  }
};
TitleHandler.prototype.onText = function(textObj) {
  if(this.isTitle) {
    this.content = textObj.text;
  }
};

TitleHandler.prototype.onCloseTag = function(name) {
  if(name == 'title') {
    this.isTitle = false;
  }
};


module.exports = TitleHandler;
