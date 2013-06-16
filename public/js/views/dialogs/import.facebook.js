var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var Import = require('views/dialogs/import');
var template = require('templates/dialogs/import.facebook');
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
  module.exports = ImportFacebook;
