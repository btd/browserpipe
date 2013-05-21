define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',   
  'views/center/container/tag.container'
], function($, _, Backbone, _state, TagContainer){
  var TrashContainer = TagContainer.extend({
    initializeView: function(options){        
      TagContainer.prototype.initializeView.call(this);   

      //TODO: for some reason adding menu options is not dectecting the methods
      //Add options for the menu
      /*this.addMenuOptions([        
        {name: "menu_option_emptyTrash", label: "Empty Trash", method: "emptyTrash"}
      ]);  */ 
    },
    emptyTrash: function(){

    }
  });
  return TrashContainer;
});