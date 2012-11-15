define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'views/containers/container',
  'views/containers/search.container',
  'views/containers/tag.container',
  'data/containers'
], function($, _, Backbone, AppView, Container, SearchContainer, TagContainer, ContainersData){
  var Dashboard = AppView.extend({
    name: 'Dashboard',
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
      for (index in this.containers)
        this.addContainer(this.containers[index]);
      return this;    
    },
    addContainer: function(container){
      var cv;
      switch(container.type){
        case 'search': cv = new SearchContainer({container: container}); break;
        case 'tag': cv = new TagContainer({container: container}); break;
      }         
      this.containersItems.push(cv);            
      this.calculateWidth();
      $(this.el).append(cv.render().el);
      this.prepareContainerEvents(cv);

      return cv;
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
    addNewRandomContainer: function(type, name){ //TODO: remove this after adding crud for containers and items
      var container = this.fakeData.generateFakeContainer(type, name);
      var cv = this.addContainer(container);
      this.scrollToContainer(cv)
      cv.select();
    },
    scrollToContainer: function(container){
      var $el = $(this.el);
      $('html, body').animate({scrollLeft: $(container.el).offset().left}, 150);
    }    
  });
  return Dashboard;
});