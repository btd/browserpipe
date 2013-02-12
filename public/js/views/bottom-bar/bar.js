define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',  
  'views/bottom-bar/breadcrumb'
], function($, _, Backbone, AppView, BreadCrumb){
  var BottomBar = AppView.extend({
    name: 'BottomBar',
    el: $("#bottom-bar"),    
    activeFilter: {},
    initializeView: function(){  
      this.currentDashBoard = this.options.currentDashBoard;
      //Creates the tags breadCrumb from the top bar
      this.breadCrumb = new BreadCrumb();
      //Manage events
      this.prepareEvents();
    },    
    renderView: function(){
      this.breadCrumb.render();
      return this;
    },
    postRender: function(){
      this.breadCrumb.setCurrentPath('', false);
      //or
      //this.breadCrumb.disable()      
    },
    prepareEvents: function(){
      var self = this;
      this.currentDashBoard.on('containerSelected', 
        function(container){
          /*var type = '';
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
        /*  self.setActiveFilter({
            type: 'breadCrumb',
            data: tag.getFullPath()
          });*/
        }
      );
      this.breadCrumb.on('selectTag', 
        function(path){
         /* self.setActiveFilter({
            type: 'breadCrumb',
            data: path
          });
          self.currentDashBoard.addNewRandomContainer("tag", path);*/
        }
      ).on('startTagNavigation', 
        function(){          
          //self.disableFilters(true, false, true, true);
        }
      ).on('stopTagNavigation', 
        function(){          
          //self.setActiveFilter(self.activeFilter);
        }
      );     
    }
  });
  return BottomBar;
});