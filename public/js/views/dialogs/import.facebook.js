define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',  
  'views/dialogs/import',
  'text!templates/dialogs/import.facebook.text'  
], function($, _, Backbone, _state, Import, template){
  var ImportFacebook = Import.extend({
    attributes : function (){
      return {
        class : 'modal hide fade',
        id : 'modal-import-facebook'
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
      var parentTag = _state.getTagByFilter("Imports/Facebook");
      this.createTagAndContainerAndClose(label, parentTag);
    }   
  });
  return ImportFacebook;
});