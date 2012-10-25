define([
  'jQuery',
  'underscore',
  'backbone'
], function($, _, Backbone){
  var FilterBarView = Backbone.View.extend({
    el: $("#filter-bar"),
    initialize: function(){  
      console.log("Initializing FilterBarView") 
      this.tagsMenuView = this.options.tagsMenuView;
      this.searchBoxView = this.options.searchBoxView;
    },   
    prepareEvents: function(){
      $('#search-box', this.el).focus(function() {
        console.log(this);
          $(this).animate({
            opacity: 1,
            width: '700px'
          }, 200, function() {
            // Animation complete.
          });
      }).focusout(function() {
        console.log(this);
          $(this).animate({
            opacity: 0.5,
            width: '17px'
          }, 200, function() {
            // Animation complete.
          });
      });
    }, 
    render: function(){
      console.log("rendering FilterBarView")
      $("#filter-bar-left", this.el).append(this.tagsMenuView.render().el);
      $("#filter-bar-right", this.el).append(this.searchBoxView.render().el);
      //Load initial tag, with the dropdown dialog close
      this.tagsMenuView.postRender();
      this.prepareEvents();
      return this;
    }
  });
  return FilterBarView;
});