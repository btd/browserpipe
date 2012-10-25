// Filename: router.js
define([
  'jQuery',
  'underscore',
  'backbone',
  'models/tag',
  'collections/tags',
  'views/tags/menu',
  'views/search/search-box',
  'views/bars/filter-bar'
], function($, _, Backbone, Tag, TagCollection, TagsMenuView, SearchBoxView, FilterBarView){
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
          //Sets the first tag as selected
          if(collection.length > 0){
            var selectedTag = collection.models[0]            
            selectedTag.set({selected: true})
            that.navigateSelectedTag(selectedTag)
            tags.selectedTag = selectedTag
          }
          //TODO: is it necessary to have the views as an attribute of AppRouter
          that.views.tagsListView = new TagsListView({collection: collection})
          that.views.tagsListView.on("onShowAddTag", that.onShowAddTag, that);
          that.views.tagsListView.on("onChangeSelectedTag", that.onChangeSelectedTag, that);
          that.views.tagsListView.render();
        }
      });   */
      that.views.tagsMenuView = new TagsMenuView()
      that.views.searchBoxView = new SearchBoxView()
      that.views.filterBarView = new FilterBarView({
        tagsMenuView: that.views.tagsMenuView, 
        searchBoxView: that.views.searchBoxView
      });
      that.views.filterBarView.render();
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
