define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'views/tags/bookmark.item',
  'text!templates/bookmarks/container.item.text',
  'text!templates/bookmarks/container.item.details.text'
], function($, _, Backbone, AppView, TagBookmarkItem, mainTemplate, detailsTemplate){
  var BookmarkContainerItem = AppView.extend({
    name: 'BookmarkContainerItem',
    tagName: 'li', 
    events: {
      "click" : "toggle",
      "click a" : "stopPropagation"
    },
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
      var compiledTemplate = _.template( mainTemplate, {bookmark: this.bookmark} );    
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
      var compiledTemplate = $(_.template( detailsTemplate, {bookmark: this.bookmark} ));
      var $tags = $(".tags", compiledTemplate);
      for (index in this.bookmark.tags) {
          var tbv = new TagBookmarkItem({tag: this.bookmark.tags[index]});
          $tags.append(tbv.render().el);
       };
       $(this.el).append(compiledTemplate)  
    },
    stopPropagation: function(e){
      e.stopPropagation();
    }
  });
  return BookmarkContainerItem;
});