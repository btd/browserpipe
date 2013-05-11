define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state'
], function($, _, Backbone, _state){
  var TrashContainer = Container.extend({
    collapsed:  false,
    initializeView: function(options){        
      Container.prototype.initializeView.call(this);
      
    }
  });
  return TrashContainer;
});