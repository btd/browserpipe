// Filename: router.js
define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',  
  'views/top-bar/dashboard',
  'views/top-bar/search',
  'views/top-bar/device',
  'views/top-bar/import',
  'views/bottom-bar/breadcrumb',
  'views/bottom-bar/trash'
], function($, _, Backbone, _state, TopBarDashboard, Search, Device, Import, BreadCrumb, Trash){
  var AppRouter = Backbone.Router.extend({
    views: {},
    routes: {      
      'dashboards': 'showEmptyDashboard',
      'dashboards/:id': 'showDashboard',
      // Default
      '*actions': 'defaultAction'
    },
    showEmptyDashboard: function(id){  
      var currentDashboard = _state.dashboards.getCurrentDashboard();
      if(currentDashboard && _state.dashboards.length > 0)
        Backbone.history.navigate("/dashboards/" + currentDashboard.get('_id'), {trigger: true});
    },
    showDashboard: function(id){  
      if(_state.dashboards.length === 0)
        Backbone.history.navigate("/dashboards", {trigger: true});
    },
    defaultAction: function(actions){
    },
    initialize: function(){
      //Load initial data
      _state.loadInitialData();

      _state.dashboards.on('currentDashboardChange', function(dashboard){
        Backbone.history.navigate("/dashboards/" + dashboard.get('_id'), {trigger: true});
      }, this);

      //Creates the top bar options           
      this.views.topBarDashboard = new TopBarDashboard({collection: _state.dashboards});     
      this.views.topBarDashboard.render();
      this.views.search = new Search();     
      this.views.search.render();
      this.views.device = new Device();     
      this.views.device.render();
      this.views.imports = new Import();     
      this.views.imports.render();

      //Creates the bottom bar options           
      this.views.breadCrumb = new BreadCrumb();     
      this.views.breadCrumb.render();
      this.views.trash = new Trash();     
      this.views.trash.render();

      //Sets the current dashboard      
      _state.dashboards.setCurrentDashboard(initialOptions.currentDashboardId);      
    }
  });
  var initialize = function(){    
    var app_router = new AppRouter;
    //Start monitoring all hashchange events for history
    Backbone.history.start({pushState: true});  
  };
  return {
    initialize: initialize
  };
});
