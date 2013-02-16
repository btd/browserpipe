// Filename: router.js
define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',  
  'views/top-bar/dashboard'
], function($, _, Backbone, _state, TopBarDashboard){
  var AppRouter = Backbone.Router.extend({
    views: {},
    routes: {
      'dashboard/:id': 'showDashboard',
      'dashboard/add': 'addDashboard',
      'dashboard/:id/edit': 'editDashboard',
      'dashboard/:id/delete': 'deleteDashboard',
      // Default
      '*actions': 'defaultAction'
    },
    showDashboard: function(id){  
    },
    addDashboard: function(){   
    },
    editDashboard: function(id){      
    },
    deleteDashboard: function(id){      
    },
    defaultAction: function(actions){
      
    },
    init: function(){
      //We have no matching route, lets display the home page
      var self = this;      
      //Creates the top bar dashboard options     
      this.views.topBarDashboard = new TopBarDashboard({collection: _state.dashboards});
    }
  });
  var initialize = function(){
    var app_router = new AppRouter;
    //Start monitoring all hashchange events for history
    Backbone.history.start();
    //Load inital data to memory
    _state.loadInitialData();
    //Init all the views
    app_router.init();    
  };
  return {
    initialize: initialize
  };
});
