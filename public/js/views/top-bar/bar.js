define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',  
  'views/top-bar/dashboard',
  'views/top-bar/searchbox'
], function($, _, Backbone, AppView, TopBarSearchBox, TopBarDashboard){
  var TopBar = AppView.extend({
    name: 'TopBar',
    el: $("#top-bar"),    
    activeFilter: {},
    initializeView: function(){  
      this.currentDashBoard = this.options.currentDashBoard;
      this.dashboard  = new TopBarDashboard();
      this.searchBox = new TopBarSearchBox();
      //Manage events
      this.prepareEvents();
    },    
    renderView: function(){
      this.dashboard.render();     
      this.searchBox.render();     
      return this;
    },
    postRender: function(){
      //this.searchBox.enable(this.activeFilter.data);
      //or
      //this.searchBox.disable();
    },
    prepareEvents: function(){
      var self = this;
      this.currentDashBoard.on('containerSelected', 
        function(container){
        /*  var type = '';
          var data = '';
          switch(container.type){
            case 'search': type = 'searchBox'; data = container.name; break;
            case 'tag': type = 'breadCrumb'; data = container.tag.getFullPath(); break;
          }
          self.setActiveFilter({
            type: type,
            data: data
          });  */
        }
      ).on('navigatedToTag', 
        function(tag){
         /* self.setActiveFilter({
            type: 'breadCrumb',
            data: tag.getFullPath()
          });*/
        }
      );
      this.searchBox.on('searchExecuted',
        function(query){
         /* self.setActiveFilter({
            type: 'searchBox',
            data: query
          });
          self.currentDashBoard.addNewRandomContainer("search", query);*/
        }
      ).on('searchBoxFocus',
        function(){          
          //self.disableFilters(false, true, true, true);
        }
      );      
    }
  });
  return TopBar;
});