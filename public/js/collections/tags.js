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
    createTag: function(model) {
      var self = this;
      var defer = $.Deferred();
      this.create(model, {
        success: function(tag) { 
          defer.resolve(tag);
          self.trigger("created", tag);
        }
      });
      return defer; //We return a deferred
    }
  });
  return TagCollection;
});