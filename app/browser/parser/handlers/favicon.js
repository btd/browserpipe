var Base = require('./base');

var FaviconHandler = function(options) {
  this.url = options.url;

  Base.apply(this, arguments);
};

FaviconHandler.prototype = Object.create(Base.prototype);

FaviconHandler.prototype.gather = function(obj) {
  obj.favicon = 'http://www.google.com/s2/favicons?domain=' + encodeURIComponent(this.url);
};

module.exports = FaviconHandler;
