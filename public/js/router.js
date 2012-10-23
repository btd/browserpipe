// Filename: router.js
define([
  'jQuery',
  'underscore',
  'backbone',
  'models/folder',
  'collections/folders',
  'views/folders/menu'
], function($, _, Backbone, Folder, FolderCollection, FoldersListView){
  var AppRouter = Backbone.Router.extend({
    views: {},
    routes: {
      // Define some URL routes
      'folders/view/:id': 'showFolder',
      'folders/add': 'addFolder',
      'folder/:id/edit': 'editFolder',
      'folder/:id/delete': 'deleteFolder',

      // Default
      '*actions': 'defaultAction'
    },
    showFolder: function(id){  
    },
    addFolder: function(){   
    },
    editFolder: function(id){      
    },
    deleteFolder: function(id){      
    },
    defaultAction: function(actions){
      
    },
    createViews: function(){
      //We have no matching route, lets display the home page
      var that = this;
      var folders = new FolderCollection();         
      folders.fetch({ 
        success: function (collection) {
          //Sets the first folder as selected
          if(collection.length > 0){
            var selectedFolder = collection.models[0]            
            selectedFolder.set({selected: true})
            that.navigateSelectedFolder(selectedFolder)
            folders.selectedFolder = selectedFolder
          }
          //TODO: is it necessary to have the views as an attribute of AppRouter
          that.views.foldersListView = new FoldersListView({collection: collection})
          that.views.foldersListView.on("onShowAddFolder", that.onShowAddFolder, that);
          that.views.foldersListView.on("onChangeSelectedFolder", that.onChangeSelectedFolder, that);
          that.views.foldersListView.render();
        }
      });   
    },
    onShowAddFolder: function(selectedFolder){ 
      this.navigate("/folders/add/" + selectedFolder.get("_id"));
    },    
    onChangeSelectedFolder: function(selectedFolder){ 
      this.navigateSelectedFolder(selectedFolder)
    },
    navigateSelectedFolder: function(selectedFolder){
      this.navigate("/folders/view/" + selectedFolder.get("_id"));
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
