define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',
  'views/view',
  'views/dialogs/import.file',
  'views/dialogs/import.twitter',
  'views/dialogs/import.facebook',
  'views/dialogs/import.delicious',
  'views/dialogs/import.pinboard'
], function($, _, Backbone, _state, AppView, ImportFile, ImportTwitter, ImportFacebook, ImportDelicious, ImportPinboard){
  var Import = AppView.extend({
    el: $("#opt-import"),
    events: {
      "click .import-open" : "openImportContainer",
      "click .import-new-file": "newImportFileDialog",
      "click .import-new-twitter":"newImportTwitterDialog",
      "click .import-new-facebook": "newImportFacebookDialog",
      "click .import-new-delicious": "newImportDeliciousDialog",
      "click .import-new-pinboard": "newImportPinboardDialog"
    },
    initializeView: function(){ 
      this.tag = _state.getTagByFilter("Imports");
    },
    openImportContainer: function(e){
      e.preventDefault();
      _state.dashboards.getCurrentDashboard().addContainer({
        "filter": this.tag.getFilter(),
        "order": 0, //TODO: manage order
        "title": this.tag.get('label'),
        "type": 3
      },{wait: true, success: function(container) { 
        _state.dashboards.setCurrentContainer(container.get('_id'));
      }}); 
      this.hideDropDown();
    },
    hideDropDown: function(){       
      //Hides the dropdown
      this.$('[data-toggle="dropdown"]').parent().removeClass('open');
    },
    newImportFileDialog: function(e){
      e.preventDefault();
      var importFile = new ImportFile();
      importFile.render();  
      this.hideDropDown();
    },
    newImportTwitterDialog: function(e){
      e.preventDefault();
      var importTwitter = new ImportTwitter();
      importTwitter.render();  
      this.hideDropDown();
    },
    newImportFacebookDialog: function(e){
      e.preventDefault();
      var importFacebook = new ImportFacebook();
      importFacebook.render();  
      this.hideDropDown();
    },
    newImportDeliciousDialog: function(e){
      e.preventDefault();
      var importDelicious = new ImportDelicious();
      importDelicious.render();  
      this.hideDropDown();
    },
    newImportPinboardDialog: function(e){
      e.preventDefault();
      var importPinboard = new ImportPinboard();
      importPinboard.render();  
      this.hideDropDown();
    }
  });
  return Import;
});