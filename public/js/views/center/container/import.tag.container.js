var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var TagContainer = require('views/center/container/tag.container');
  var ImportContainer = TagContainer.extend({
    initializeView: function(options){        
      TagContainer.prototype.initializeView.call(this);      
    }
  });
  module.exports = ImportContainer;
