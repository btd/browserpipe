define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'views/containers/view',
  'data/containers'
], function($, _, Backbone, AppView, ContainerView, ContainersData){
  var DashboardView = AppView.extend({
    name: 'DashboardView',
    tagName: 'div', 
    containersViews: [],
    attributes : function (){
      return {
        class : 'dashboard',
        //TODO: This should have a real id 
        id : "dashboard" + Math.random()
      }
    },    
    initializeView: function(){ 
      //TODO: Remove fake initial containers to test html/css design
      this.fakeData = new ContainersData();
      this.containers  = this.fakeData.getInitialFakeContainers();  
    },     
    renderView: function(){
      for (index in this.containers) {
          var cv = new ContainerView({container: this.containers[index]});
          this.containersViews.push(cv);
          $(this.el).append(cv.render().el);
       };
      return this;    
    },
    calculateHeight: function(){
      var wheight = $(window).height();
      $(this.el).height(wheight - 50);
    },    
    calculateWidth: function(){
      var $el = $(this.el);
      $el.width("auto");
      var width = this.containersViews.length * 256;
      if($el.width() < width) 
        $el.width(width);
    },
    postRender: function(){
      var _this = this;
      this.calculateHeight();
      this.calculateWidth();
      window.onresize = function(event) {        
        for (index in _this.containersViews) {
          _this.containersViews[index].calculateHeight();
         };
        _this.calculateHeight();
      };
    },
    addNewRandomContainer: function(name){ //TODO: remove this after adding crud for containers and bookmarks
      var container = this.fakeData.generateFakeContainer(name);
      var cv = new ContainerView({container: container});
      this.containersViews.push(cv);            
      this.calculateWidth();
      $(this.el).append(cv.render().el);
    }
  });
  return DashboardView;
});