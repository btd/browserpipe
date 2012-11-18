define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'text!templates/tags/item.tag.text'
], function($, _, Backbone, AppView, template){
  var ItemTag = AppView.extend({
    name: 'ItemTag',
    tagName: 'li', 
    events: {
      "click" : "tagClicked"
    },
    attributes : function (){
      return {
        class : 'tag',
        //TODO: This should have a real id 
        id : "tag-item" + Math.random()
      }
    },    
    initializeView: function(){    
      this.tag = this.options.tag;
      this.tag = this.options.temporal;
    },     
    renderView: function(){
      var compiledTemplate = _.template( template, {tag: this.tag, temporal: this.temporal} );    
      $(this.el).html(compiledTemplate);       
      return this;   
    },
    postRender: function(){
    },
    tagClicked: function(){
    }
  });
  return ItemTag;
});