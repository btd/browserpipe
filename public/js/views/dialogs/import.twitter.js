define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',  
  'views/dialogs/import',
  'text!templates/dialogs/import.twitter.text'  
], function($, _, Backbone, _state, Import, template){
  var ImportTwitter = Import.extend({
    attributes : function (){
      return {
        class : 'modal hide fade',
        id : 'modal-import-twitter'
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
      var parentTag = _state.getTagByFilter("Imports/Twitter");
      this.createTagAndContainerAndClose(label, parentTag);
    }   
  });
  return ImportTwitter;
});