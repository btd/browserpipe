var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var TagContainer = require('views/center/container/tag.container');
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
  module.exports = TrashContainer;
