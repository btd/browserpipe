define([
  'jQuery',
  'underscore',
  'backbone',
  'text!templates/search/search.box.text'
], function($, _, Backbone, template){
  var SearchBoxView = Backbone.View.extend({
    tagName: 'form', 
    attributes: function (){
      return {
        class : 'form-search'
      };
    }, 
    initialize: function(){  
      console.log("Initializing SearchBoxView")
    },     
    render: function(){
      console.log("rendering SearchBoxView")
      var compiledTemplate = _.template( template, {} );      
      $(this.el).html(compiledTemplate);   
      return this;    
    }
  });
  return SearchBoxView;
});