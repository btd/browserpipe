define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'views/containers/item',
  'data/containers'
], function($, _, Backbone, AppView, ContainerItem, ContainersData){
  var DashboardItem = AppView.extend({
    name: 'DashboardItem',
    tagName: 'div', 
    containersItems: [],
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
          var cv = new ContainerItem({container: this.containers[index]});
          this.containersItems.push(cv);
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
      var width = this.containersItems.length * 256;
      if($el.width() < width){ 
        $el.width(width);
        //Height has to be recalculated in case the x scrollbar appears
        this.calculateHeight();
      }
    },
    postRender: function(){
      var self = this;
      this.calculateHeight();
      this.calculateWidth();
      $(window).resize(function() {
        for (index in self.containersItems) {
          self.containersItems[index].calculateHeight();
         };
        self.calculateHeight();
      });
    },
    addNewRandomContainer: function(type, name){ //TODO: remove this after adding crud for containers and bookmarks
      var container = this.fakeData.generateFakeContainer(type, name);
      var cv = new ContainerItem({container: container});
      this.containersItems.push(cv);            
      this.calculateWidth();
      $(this.el).append(cv.render().el);
    }
  });
  return DashboardItem;
});