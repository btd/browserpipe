// Filename: router.js
define([
  'jQuery',
  'underscore',
  'backbone',
  'models/tag',
  'collections/tags',
  'views/containers/list',
  'views/tags/breadcrumb',
  'views/search/search-box',
  'views/bars/top-bar'
], function($, _, Backbone, Tag, TagCollection, ContainersListView, TagsBreadCrumbView, SearchBoxView, TopBarView){
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
      /*var tags = new TagCollection();         
      tags.fetch({ 
        success: function (collection) {
          }
      });   */
      that.views.containersListView = new ContainersListView()
      that.views.tagsBreadCrumbView = new TagsBreadCrumbView()
      that.views.searchBoxView = new SearchBoxView()
      that.views.topBarView = new TopBarView({
        tagsBreadCrumbView: that.views.tagsBreadCrumbView, 
        searchBoxView: that.views.searchBoxView
      });
      that.views.containersListView.render();
      that.views.topBarView.render();
    },
    onShowAddTag: function(selectedTag){ 
      this.navigate("/tags/add/" + selectedTag.get("_id"));
    },    
    onChangeSelectedTag: function(selectedTag){ 
      this.navigateSelectedTag(selectedTag)
    },
    navigateSelectedTag: function(selectedTag){
      this.navigate("/tags/view/" + selectedTag.get("_id"));
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
