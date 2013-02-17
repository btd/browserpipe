// Filename: router.js
define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',  
  'views/top-bar/dashboard'
], function($, _, Backbone, _state, TopBarDashboard, EditDashboard){
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
      //We have no matching route, lets display the home page
      var self = this;      
      //Creates the top bar dashboard options           
      this.views.topBarDashboard = new TopBarDashboard({collection: _state.dashboards});     
      this.views.topBarDashboard.render();

      _state.dashboards.on('currentDashboardChange', function(dashboard){
        Backbone.history.navigate("/dashboards/" + dashboard.get('_id'), {trigger: true});
      }, this);

     // _state.dashboards.create({ label: "dani dani" }, {wait: true});      
     /* _state.dashboards.remove(_state.dashboards.first())
      _state.dashboards.remove(_state.dashboards.first())
      _state.dashboards.add({ _id: "34324342", label: "test1" });      
      _state.dashboards.add({ _id: "5435y56", label: "test2" });      
      _state.dashboards.add({ _id: "8678788", label: "test3" });     */ 
    }
  });
  var initialize = function(){
    _state.loadInitialData();
    var app_router = new AppRouter;
    //Start monitoring all hashchange events for history
    Backbone.history.start({pushState: true});  
  };
  return {
    initialize: initialize
  };
});
