define([
  'underscore',
  'backbone',
  'models/tag'
], function(_, Backbone, Tag){
  var TagCollection = Backbone.Collection.extend({
    model: Tag,    
    url: "/tags",
    initialize: function(){
    }
  });
  return TagCollection;
});