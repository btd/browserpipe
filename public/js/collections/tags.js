define([
  'underscore',
  'backbone'
], function(_, Backbone){
  var TagCollection = Backbone.Collection.extend({
    url: "/tags",
    initialize: function(models, options){
      var Tag = require('models/tag')
      this.model = Tag
    },
    createTag: function(model, options) {
      var self = this;
      var success = options.success;
      options.success = function(tag) {  
        success(tag);
        self.trigger("created", tag);
      }
      return this.create(model, options);
    }
  });
  return TagCollection;
});