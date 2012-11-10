define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'views/bookmarks/container-view',
  'text!templates/containers/view.text'
], function($, _, Backbone, AppView, BookmarkContainerView, template){
  var ContainerView = AppView.extend({
    name: 'ContainerView',
    tagName: 'div', 
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
          var bcv = new BookmarkContainerView({bookmark: this.container.bookmarks[index]});
          $bk.append(bcv.render().el);
       };
      return this;   
    },
    calculateHeight: function(){
      var wheight = $(window).height();
      $bk = $(".bookmarks", this.el);
      $bk.height("auto");
      var value = wheight - 110;
      if($bk.height() > value)
        $bk.height(value);
    },
    postRender: function(){
      this.calculateHeight();
    }
  });
  return ContainerView;
});