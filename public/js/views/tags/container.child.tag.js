define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view'
], function($, _, Backbone, AppView){
  var ContainerChildTag = AppView.extend({
    name: 'ContainerChildTag',
    tagName: 'li', 
    events: {
      "click" : "navigateToTag"
    },
    attributes : function (){
      return {
        class : 'tag',
        //TODO: This should have a real id 
        id : "tag" + Math.random()
      }
    },    
    initializeView: function(){  
      this.tag = this.options.tag;
    },     
    renderView: function(){      
      $(this.el).html(this.tag.get('label'));       
      return this;   
    },
    postRender: function(){      
    },
    navigateToTag: function(e){
      e.stopPropagation();      
      this.trigger("navigateToTag", this.tag);
    }
  });
  return ContainerChildTag;
});