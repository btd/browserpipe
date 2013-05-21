define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',   
  'views/center/container/tag.container',
  'views/dialogs/add.bookmark'
], function($, _, Backbone, _state, TagContainer, AddBookmark){
  var UserTagContainer = TagContainer.extend({
    initializeView: function(options){   
      TagContainer.prototype.initializeView.call(this, options);

      //TODO: for some reason adding menu options is not dectecting the methods
      //Add options for the menu
     /* this.addMenuOptions([        
        {name: "menu_option_changeName", label: "Edit", method: "editTag"}
      ]); */
    },
    renderView: function(){
      this
        .renderMenuOptions()
        .renderHeader()
        .renderBox()
        .renderChildsTags()
        .renderItems()
        .renderFooter(); //Adds the footer
      return this; 
    },
    renderFooter: function(){        
      var self = this;
      $(this.el).append('<a class="opt-add-bkmrk">Add bookmark<a>'); 
      this.$('.opt-add-bkmrk').on('click', function(){
        self.addBkmrk();
      });
      return this;
    },
    addBkmrk: function(){
      var addBookmark = new AddBookmark({tag: this.model.tag});
      addBookmark.render();      
    },
    editTag: function(){
      
    }
  });
  return UserTagContainer;
});