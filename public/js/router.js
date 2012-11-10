// Filename: router.js
define([
  'jQuery',
  'underscore',
  'backbone',
  'views/dashboards/view',
  'views/tags/breadcrumb',
  'views/search/search-box',
  'views/bars/top-bar'
], function($, _, Backbone, DashboardView, TagsBreadCrumbView, SearchBoxView, TopBarView){
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
      var that = this;      
      //TODO: Here it should draw the last loaded dashboard
      that.views.dashboardView = new DashboardView();
      //Creates the tags breadCrumb from the top bar
      that.views.tagsBreadCrumbView = new TagsBreadCrumbView();
      //Creates the search box from the top bar
      that.views.searchBoxView = new SearchBoxView();
      //Creates the top bar      
      that.views.topBarView = new TopBarView({
        tagsBreadCrumbView: that.views.tagsBreadCrumbView, 
        searchBoxView: that.views.searchBoxView
      });
      //Render views
      that.views.topBarView.render()
      $("#main-container").append(that.views.dashboardView.render().el);
      //TODO: Event to add temporal tag containers
      that.views.tagsBreadCrumbView.on('TagSelected', 
        function(path){
          that.views.dashboardView.addNewRandomContainer(path)
        }
      );


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
