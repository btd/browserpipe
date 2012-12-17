define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view'
], function($, _, Backbone, AppView){
  var Tag = AppView.extend({
    name: 'Tag',
    tagName: 'li', 
    events: {
      "click" : "clicked"
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
    },     
    renderView: function(){  
      if(this.tag.get('isRoot'))    
        $(this.el).html('<img width="16px" src="/img/tag.png">');       
      else
        $(this.el).html(this.tag.get('label'));             
      return this;   
    },
    postRender: function(){
    },
    clicked: function(){
      this.trigger('tagClicked', this.tag);
    }
  });
  return Tag;
});