define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'views/dialogs/view.bookmark',
  'text!templates/items/container.item.simple.text'
], function($, _, Backbone, AppView, ViewBookmark, mainTemplate){
  var ContainerItem = AppView.extend({
    name: 'ContainerItem',
    tagName: 'li', 
    events: {
      "click" : "open",
      "click a" : "stopPropagation"
    },
    attributes : function (){
      return {
        class : 'item',
        id : "item_" + this.model.get('_id')
      }
    },    
    initializeView: function(){  
    },     
    renderView: function(){
      var compiledTemplate = _.template( mainTemplate, {item: this.model} );    
      $(this.el).html(compiledTemplate);       
      return this;   
    },
    postRender: function(){
    },
    open: function(){
      var viewBookmark = new ViewBookmark({model: this.model});
      viewBookmark.render();   
    },
    stopPropagation: function(e){
      e.stopPropagation();
    }
  });
  return ContainerItem;
});