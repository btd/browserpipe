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
          this.breadCrumb.setCurrentPath(this.activeFilter.data, false, false);
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
      this.breadCrumb.on('selectTag', 
        function(path){
          self.setActiveFilter({
            type: 'breadCrumb',
            data: path
          });
          self.currentDashBoard.addNewRandomContainer("tag", path);
        }
      );
      this.breadCrumb.on('startTagNavigation', 
        function(){          
          self.disableFilters(true, false, true, true);
        }
      );
      this.breadCrumb.on('stopTagNavigation', 
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
      );
      this.searchBox.on('searchBoxFocus',
        function(){          
          self.disableFilters(false, true, true, true);
        }
      );      
    }


   /* prepareEvents: function(){
      var _this = this;     
      window.onresize = function(event) {
        _this.calculateHeight();
      };
      $searchBox = $('#search-box', this.el);
      if(this.activeFilter == 'breadcrumb')
        this.prepareBreadCrumbActiveEvents(_this, $searchBox);
      else
        this.prepareSearchBoxActiveEvents(_this, $searchBox);
      this.breadCrumbView.on('TagSelected', 
        function($tagDropDown){
          if(_this.activeFilter != 'breadcrumb'){
            _this.prepareBreadCrumbActiveEvents(_this, $searchBox);
          }
        }
      );
      this.searchBox.on('SearchBtnClicked', 
        function(){
          if(_this.activeFilter != 'searchBox'){
            _this.prepareSearchBoxActiveEvents(_this, $searchBox);
          }
        }
      );
      /*this.breadCrumbView.on('ShowTemporalTag', 
        function(){
          $searchBox.blur(); 
          _this.hideSearchBox($searchBox)
        }
      );     
    },
    prepareBreadCrumbActiveEvents: function(_this, $searchBox){      
      _this.activeFilter = 'breadcrumb';
      _this.hideSearchBox($searchBox)
      console.time('Executing prepareBreadCrumbActiveEvents');
      _this.breadCrumbView.unbind('HideDropDownMenu');   
      $searchBox.focus(function() {
         _this.showSearchBox($(this));         
      }).focusout(function() {
         _this.hideSearchBox($(this));  
      });
      console.timeEnd('Executing prepareBreadCrumbActiveEvents');
    },
    prepareSearchBoxActiveEvents: function(_this, $searchBox){          
      _this.activeFilter = 'searchbox';
      _this.showSearchBox($searchBox)
      console.time('Executing prepareSearchBoxActiveEvents');
      $searchBox.unbind('focus focusout');        
     /* this.breadCrumbView.on('HideDropDownMenu', 
        function($tagDropDown){
          if(!$('.tag-dropdown-menu').is(':visible')) 
            _this.showSearchBox($searchBox)
        }
      );    
      //this.breadCrumbView.collapse();
      console.timeEnd('Executing prepareSearchBoxActiveEvents');  
    }*/
  });
  return TopBar;
});