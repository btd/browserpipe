define([
  'underscore',
  'backbone',
  'models/container'
], function(_, Backbone, Container){
  var ContainerCollection = Backbone.Collection.extend({
    model: Container,    
    url: "/containers",
    initialize: function(models, options){      
    }
  });
  return ContainerCollection;
});