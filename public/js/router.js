// Filename: router.js
define([
  'jQuery',
  'underscore',
  'backbone',
  'views/dashboards/dashboard',
  'views/top-bar/bar'
], function($, _, Backbone, Dashboard, TopBar){
  var AppRouter = Backbone.Router.extend({
    views: {},
    routes: {
      // Define some URL routes
      'tags/view/:id': 'showTag',
      'tags/add': 'addTag',
      'tag/:id/edit': 'editTag',
      'tag/:id/delete': 'deleteTag',

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
    createViews: function(){
      //We have no matching route, lets display the home page
      var self = this;      
      //TODO: Here it should draw the last loaded dashboard
      this.views.dashboard = new Dashboard();
      //Creates the top bar      
      this.views.topBar = new TopBar({currentDashBoard: this.views.dashboard});
      //Render views
      this.views.topBar.render()
      $("#main-container").append(this.views.dashboard.render().el);
    },
    onShowAddTag: function(selectedTag){ 
      //this.navigate("/tags/add/" + selectedTag.get("_id"));
    },    
    onChangeSelectedTag: function(selectedTag){ 
      //this.navigateSelectedTag(selectedTag)
    },
    navigateSelectedTag: function(selectedTag){
      //this.navigate("/tags/view/" + selectedTag.get("_id"));
    }

  });
  var initialize = function(){
    var app_router = new AppRouter;

    //Start monitoring all hashchange events for history
    Backbone.history.start();

    //Init all the views
    app_router.createViews();
    

  };
  return {
    initialize: initialize
  };
});
