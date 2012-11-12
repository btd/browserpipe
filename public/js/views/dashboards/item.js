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
          this.prepareContainerEvents(cv);
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
    prepareContainerEvents: function(container){
      var self = this;
      container.on('selected', 
        function(container){
          for (index in self.containersItems) {
            if(self.containersItems[index].getContainerName() != container.name)
              self.containersItems[index].unSelect();
          };
          self.trigger('containerSelected', container);
        }
      );
    },
    getContainer: function(type, name){
      for (index in this.containersItems) {
        var cv = this.containersItems[index];
        if(cv.getContainerName() == name && cv.getContainerType() == type)
          return cv;
      };
      return null;
    },
    addNewRandomContainer: function(type, name){ //TODO: remove this after adding crud for containers and bookmarks
      var cv = this.getContainer(type, name);
      if(!cv){
        var container = this.fakeData.generateFakeContainer(type, name);
        cv = new ContainerItem({container: container});
        this.containersItems.push(cv);            
        this.calculateWidth();
        $(this.el).append(cv.render().el);
        this.prepareContainerEvents(cv);
      }
      this.scrollToContainer(cv)
      cv.select();
    },
    scrollToContainer: function(container){
      var $el = $(this.el);
      $('html, body').animate({scrollLeft: $(container.el).offset().left}, 150);
    }    
  });
  return DashboardItem;
});