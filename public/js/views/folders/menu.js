define([
  'jQuery',
  'underscore',
  'backbone',
  'views/folders/menu.item'
], function($, _, Backbone, FoldersMenuItemView){
  var FoldersMenuView = Backbone.View.extend({
    el: $("#folder-menu"),
    events: {
      'click #btn-add-folder': 'addFolderBtnClicked',
    },   
    initialize: function(){  
      this.collection.bind("reset", this.render);
      this.collection.on("add", this.addItem);         
      this.collection.on("change:selected", this.changeSelected, this);
    }, 
    addItem: function( model ){      
      
    },
    addFolderBtnClicked: function(e){
      e.preventDefault();
      this.trigger('onShowAddFolder', this.collection.selectedFolder);
    },
    changeSelected: function( model, val, options){ 
      //Checks only if the change corresponds to the selected one, to avoid been called twice
      if(val){
        this.collection.selectedFolder.set({selected: false});      
        this.collection.selectedFolder = model;
        this.trigger('onChangeSelectedFolder', this.collection.selectedFolder);
      }
    },
    render: function(){
      _.each(this.collection.models, function (folder) {
        var folderEl = new FoldersMenuItemView({model: folder}).render().el
        $('.nav:first', this.el).append(folderEl);
      }, this);

      $('#btn-add-folder').tooltip();   

      return this;
    }
  });
  return FoldersMenuView;
});
