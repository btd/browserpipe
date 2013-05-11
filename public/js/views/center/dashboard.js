define([
  'jQuery',
  'underscore',
  'backbone',
  'config',
  'views/view',
  'views/center/container/search.container',
  'views/center/container/tag.container'
], function($, _, Backbone, config, AppView, SearchContainer, TagContainer){
  var Dashboard = AppView.extend({
    tagName: 'div',    
    attributes : function (){
      return {
        class : 'dashboard',
        id : "dash" + this.model.get('_id')
      }
    },    
    initializeView: function(options){ 
      var self = this;
      this.containersViews = new Array();
      //A new container is added
      this.model.get('containers').on('add', function(container){
        self.addContainer(container)
      });
      //An existing container is removed
      this.model.get('containers').on('remove', function(container){
        self.removeContainer(container)
      });
    },     
    renderView: function(){      
      //Renders each container in the dashboard
      var self = this;
      _.map(this.model.get('containers').models, function(container){ self.addContainer(container); });
      return this;    
    },
    addContainer: function(container){
      //Creates a view for the container depending on the type
      var cv;
      switch(container.get('type')){        
        case 1: cv = new TagContainer({model: container}); break;
        case 2: cv = new SearchContainer({model: container}); break;
      }         
      this.containersViews.push(cv);            
      //Calculates the dashboard width and height
      this.calculateWidthAndHeight();
      //Renders the view
      $(this.el).append(cv.render().el);      
      //Scroll to the container to make it visible
      this.scrollToContainer(cv);
      return cv;
    },
    removeContainer: function(container){
      //Gets the container view
      var cv = _.find(this.containersViews, function(cv){ return cv.model.get('_id') === container.get('_id'); })
      //Removes the view from the list
      var index = this.containersViews.indexOf(cv);
      this.containersViews.splice(index, 1);
      //Destroy the view and removes the element
      cv.dispose();
      //Calculate width
      this.calculateWidthAndHeight();
    },
    calculateHeight: function(){
      var wheight = $(window).height();
      //Calculates the height of the dashboard
      this.$el.height(wheight - config.HEADER_HEIGHT - config.BOTTOM_HEIGHT);
      //Calculates the height of each container view
      for (index in this.containersViews)
        this.containersViews[index].calculateHeight();
    },    
    calculateWidthAndHeight: function(){     
      var windowWidth = $(window).width();
      var width = this.containersViews.length * config.CONTAINER_WIDTH;
      var parentWidth = width + config.CONTAINER_HORIZONTAL_MARGIN;
      if(parentWidth < windowWidth){ 
        this.$el.parent().width(windowWidth);
        this.$el.width(windowWidth - config.CONTAINER_HORIZONTAL_MARGIN);                
      }
      else {
        this.$el.parent().width(parentWidth);
        this.$el.width(width);        
      }
      //Height has to be recalculated in case the x scrollbar appears
      this.calculateHeight();
    },
    postRender: function(){
      var self = this;      
      this.calculateWidthAndHeight();
      //If window size changes, height is recalculated
      $(window).resize(function() {
        self.calculateHeight();
      });
    },
    scrollToContainer: function(container){
      var $el = $(this.el);
      $('html, body').animate({scrollLeft: $(container.el).offset().left}, 150);
    },
    dispose: function() {
      for (index in this.containersViews)
        this.containersViews[index].dispose();
      AppView.prototype.remove.call(this);
    }  
  });
  return Dashboard;
});