define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',  
  'views/dialogs/import',
  'text!templates/dialogs/import.delicious.text'  
], function($, _, Backbone, _state, Import, template){
  var ImportDelicious = Import.extend({
    attributes : function (){
      return {
        class : 'modal hide fade',
        id : 'modal-import-delicious'
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
      var parentTag = _state.getTagByFilter("Imports/Delicious");
      this.createTagAndContainerAndClose(label, parentTag);
    }   
  });
  return ImportDelicious;
});