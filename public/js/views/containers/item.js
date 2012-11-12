define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'views/bookmarks/container.item',
  'text!templates/containers/item.text'
], function($, _, Backbone, AppView, BookmarkContainerItem, template){
  var ContainerItem = AppView.extend({
    name: 'ContainerItem',
    tagName: 'div', 
    events: {
      "click" : "select"
    },
    attributes : function (){
      return {
        class : 'container',
        //TODO: This should have a real id 
        id : "container" + Math.random()
      }
    },    
    initializeView: function(){     
      this.container = this.options.container;
    },     
    renderView: function(){
      var compiledTemplate = _.template( template, {container: this.container} );    
      $(this.el).html(compiledTemplate);  
      $bk = $(".bookmarks", this.el);
      for (index in this.container.bookmarks) {
          var bcv = new BookmarkContainerItem({bookmark: this.container.bookmarks[index]});
          $bk.append(bcv.render().el);
       };
      return this;   
    },    
    postRender: function(){
      this.calculateHeight();
    },
    calculateHeight: function(){
      var wheight = $(window).height();
      var value = wheight - 110;
      $(".bookmarks", this.el).css("max-height", value);
    },
    getContainerName: function(){
      return this.container.name;
    },
    getContainerType: function(){
      return this.container.type;
    },
    select: function(){
      $(this.el).addClass("selected");
      this.trigger("selected", this.container);
    },
    unSelect: function(){
      $(this.el).removeClass("selected");
    }
  });
  return ContainerItem;
});