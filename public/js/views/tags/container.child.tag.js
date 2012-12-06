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
      this.path = this.options.path;
      this.title = this.options.title;
      if(this.options.isBackOption)
        $(this.el).addClass('back')
    },     
    renderView: function(){      
      $(this.el).html(this.title);       
      return this;   
    },
    postRender: function(){      
    },
    navigateToTag: function(e){
      e.stopPropagation();      
      this.trigger("navigateToTag", this.path);
    }
  });
  return ContainerChildTag;
});