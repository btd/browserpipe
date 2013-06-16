var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var AppView = require('views/view');
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
  module.exports = ContainerChildTag;
