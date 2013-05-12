define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',  
  'views/dialogs/import',
  'text!templates/dialogs/import.pinboard.text'  
], function($, _, Backbone, _state, Import, template){
  var ImportPinboard = Import.extend({
    attributes : function (){
      return {
        class : 'modal hide fade',
        id : 'modal-import-pinboard'
      }
    },
    initializeView: function(options){ 
    },     
    prepareTemplate: function(){ 
      return _.template(template, {
      }); 
    },
    postRender: function(){

    },
    save: function(){
      var label = this.getCurrentTime();
      var parentTag = _state.getTagByFilter("Imports/Pinboard");
      this.createTagAndContainerAndClose(label, parentTag);
    }   
  });
  return ImportPinboard;
});