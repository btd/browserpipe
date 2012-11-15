define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'views/tags/item.tag',
  'text!templates/items/container.item.text',
  'text!templates/items/container.item.details.text'
], function($, _, Backbone, AppView, ItemTag, mainTemplate, detailsTemplate){
  var ContainerItem = AppView.extend({
    name: 'ContainerItem',
    tagName: 'li', 
    events: {
      "click" : "toggle",
      "click a" : "stopPropagation"
    },
    attributes : function (){
      return {
        class : 'item',
        //TODO: This should have a real id 
        id : "item" + Math.random()
      }
    },    
    initializeView: function(){     
      this.item = this.options.item;
    },     
    renderView: function(){
      var compiledTemplate = _.template( mainTemplate, {item: this.item} );    
      $(this.el).html(compiledTemplate);       
      return this;   
    },
    postRender: function(){
      $(this.el).draggable({ 
        scroll: false,
        helper: 'clone',
        start : function() {
        },
        stop: function() {
        }
      });
    },
    toggle: function(){
      $details = $(".details", this.el);
      if($details.length)
        if($details.hasClass("collapsed"))
          $details.removeClass("collapsed")
        else
          $details.addClass("collapsed")
      else 
        this.loadDetails();
    },
    loadDetails: function(){      
      var compiledTemplate = $(_.template( detailsTemplate, {item: this.item} ));
      var $tags = $(".tags", compiledTemplate);
      for (index in this.item.tags) {
          var tbv = new ItemTag({tag: this.item.tags[index]});
          $tags.append(tbv.render().el);
       };
       $(this.el).append(compiledTemplate)  
    },
    stopPropagation: function(e){
      e.stopPropagation();
    }
  });
  return ContainerItem;
});