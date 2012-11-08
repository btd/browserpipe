define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view'
], function($, _, Backbone, AppView){
  var ContainersListView = AppView.extend({
    name: 'ContainersListView',
    el: $("#containers-list"), 
    initializeView: function(){ 
    	this.calculateHeight();
    },     
    renderView: function(){
      	return this;    
    },
    calculateHeight: function(){
    	var wheight = $(window).height();
        $(this.el).height(wheight - 50);
    },
    postRender: function(){
      var _this = this;
      window.onresize = function(event) {
      	_this.calculateHeight();
      };
    }
  });
  return ContainersListView;
});