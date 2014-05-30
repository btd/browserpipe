var Base = require('./base');

var util = require('../../util');

var FaviconHandler = function(options) {
  Base.apply(this, arguments);
};

FaviconHandler.prototype = Object.create(Base.prototype);

//TODO we can do this ourself
FaviconHandler.prototype.gather = function(obj) {
  obj.favicon = util.googleFavicon(this.url);
};

module.exports = FaviconHandler;
