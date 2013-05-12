define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',   
  'views/center/container/tag.container'
], function($, _, Backbone, _state, TagContainer){
  var DeviceContainer = TagContainer.extend({
    initializeView: function(options){        
      TagContainer.prototype.initializeView.call(this);      
    }
  });
  return DeviceContainer;
});