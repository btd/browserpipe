// Filename: router.js
define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',
  'views/dashboards/dashboard',
  'views/top-bar/bar',
  'views/bottom-bar/bar'
], function($, _, Backbone, _state, Dashboard, TopBar, BottomBar){
  var AppRouter = Backbone.Router.extend({
    views: {},
    routes: {
      'dashboard/:id': 'showDashboard',

      // Define some URL routes
      //'tags/view/:id': 'showTag',
      //'tags/add': 'addTag',
      //'tag/:id/edit': 'editTag',
      //'tag/:id/delete': 'deleteTag',

      // Default
      '*actions': 'defaultAction'
    },
    showTag: function(id){  
    },
    addTag: function(){   
    },
    editTag: function(id){      
    },
    deleteTag: function(id){      
    },
    defaultAction: function(actions){
      
    },
    showDashboard: function(id){
    },
    createViews: function(){
      //We have no matching route, lets display the home page
      var self = this;      
      //TODO: Here it should draw the last loaded dashboard
      this.views.dashboard = new Dashboard();
      //Creates the top bar      
      this.views.topBar = new TopBar({currentDashBoard: this.views.dashboard});
      //Creates the bottom bar      
      this.views.bottomBar = new BottomBar({currentDashBoard: this.views.dashboard});
      //Render views
      this.views.topBar.render()
      this.views.bottomBar.render()
      $("#main-container").append(this.views.dashboard.render().el);
    }
  });
  var initialize = function(){
    var app_router = new AppRouter;
    //Start monitoring all hashchange events for history
    Backbone.history.start();
    //Load inital data
    _state.loadInitialData();
    //Init all the views
    app_router.createViews();    
  };
  return {
    initialize: initialize
  };
});
