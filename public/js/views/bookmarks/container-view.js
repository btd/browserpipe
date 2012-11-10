define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'text!templates/bookmarks/view.container.text'
], function($, _, Backbone, AppView, template){
  var BookmarkContainerView = AppView.extend({
    name: 'BookmarkContainerView',
    tagName: 'li', 
    attributes : function (){
      return {
        class : 'bookmark',
        //TODO: This should have a real id 
        id : "bookmark" + Math.random()
      }
    },    
    initializeView: function(){     
      this.bookmark = this.options.bookmark;
    },     
    renderView: function(){
      var compiledTemplate = _.template( template, {bookmark: this.bookmark} );    
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
    }
  });
  return BookmarkContainerView;
});