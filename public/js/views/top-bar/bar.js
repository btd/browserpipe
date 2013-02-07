define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',  
  'views/top-bar/breadcrumb',
  'views/top-bar/searchbox'
], function($, _, Backbone, AppView, BreadCrumb, SearchBox){
  var TopBar = AppView.extend({
    name: 'TopBar',
    el: $("#top-bar"),    
    activeFilter: {},
    initializeView: function(){  
      this.currentDashBoard = this.options.currentDashBoard;
      //Creates the tags breadCrumb from the top bar
      this.breadCrumb = new BreadCrumb();
      //Creates the search box from the top bar
      this.searchBox = new SearchBox();
      //Manage events
      this.prepareEvents();
    },    
    renderView: function(){
      this.breadCrumb.render();
      this.searchBox.render();     
      return this;
    },
    postRender: function(){
      this.setActiveFilter({
        type: 'searchBox',
        data: ''
      })
    }, 
    setActiveFilter: function(activeFilter){
      this.activeFilter = activeFilter;
      switch (this.activeFilter.type){
        case "searchBox":{
          this.searchBox.enable(this.activeFilter.data);
          this.disableFilters(false, true, true, true);
          break;
        }
        case "breadCrumb":{
          this.breadCrumb.setCurrentPath(this.activeFilter.data, false);
          this.disableFilters(true, false, true, true);
          break;
        }
        case "devices":{
          this.disableFilters(true, true, false, true);
          break;
        }
        case "import":{
          this.disableFilters(true, true, true, false);
          break;
        }
      }
    },
    disableFilters: function(disableSearchBox, disableBreadCrumb, disableDevices, disableImport){
      if(disableSearchBox)
        this.searchBox.disable();
      if(disableBreadCrumb)
        this.breadCrumb.disable();
    },
    prepareEvents: function(){
      var self = this;
      this.currentDashBoard.on('containerSelected', 
        function(container){
          var type = '';
          var data = '';
          switch(container.type){
            case 'search': type = 'searchBox'; data = container.name; break;
            case 'tag': type = 'breadCrumb'; data = container.tag.getFullPath(); break;
          }
          self.setActiveFilter({
            type: type,
            data: data
          });  
        }
      ).on('navigatedToTag', 
        function(tag){
          self.setActiveFilter({
            type: 'breadCrumb',
            data: tag.getFullPath()
          });
        }
      );
      this.breadCrumb.on('selectTag', 
        function(path){
          self.setActiveFilter({
            type: 'breadCrumb',
            data: path
          });
          self.currentDashBoard.addNewRandomContainer("tag", path);
        }
      ).on('startTagNavigation', 
        function(){          
          self.disableFilters(true, false, true, true);
        }
      ).on('stopTagNavigation', 
        function(){          
          self.setActiveFilter(self.activeFilter);
        }
      );
      this.searchBox.on('searchExecuted',
        function(query){
          self.setActiveFilter({
            type: 'searchBox',
            data: query
          });
          self.currentDashBoard.addNewRandomContainer("search", query);
        }
      ).on('searchBoxFocus',
        function(){          
          self.disableFilters(false, true, true, true);
        }
      );      
    }
  });
  return TopBar;
});