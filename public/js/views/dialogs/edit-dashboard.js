define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',  
  'text!templates/dialogs/edit-dashboard.text'  
], function($, _, Backbone, AppView, template){
  var EditDashboard = AppView.extend({
    name: 'EditDashboard', 
    attributes : function (){
      return {
        class : 'modal hide fade',
        id : 'modal-edit-dash'
      }
    },  
    events: {
      "shown": "shown",
      "hidden": "hidden",
      "click .opt-save": "save",
      "click .opt-cancel": "close",
      "click .opt-move-to-trash": "moveToTrash",
      "click .opt-move-to-trash-no": "moveToTrashCanceled",
      "click .opt-move-to-trash-yes": "moveToTrashConfirmed"
    }, 
    initializeView: function(options){ 
      this.dashboard = options.dashboard;
    },     
    renderView: function(){       
      var title = "Create dashboard";
      var showTrash = false;
      var optSaveLabel = "Create";
      if(this.dashboard){
        title = "Edit dashboard";
        showTrash = true;
        optSaveLabel = "Save changes";
      }
      var compiledTemplate = _.template(template, {
        dashboard: this.dashboard,
        title: title,
        showTrash: showTrash,
        optSaveLabel: optSaveLabel
      });    
      this.$el.html(compiledTemplate).appendTo('#dialogs').modal('show');
      return this;    
    },
    postRender: function(){

    },
    save: function(){
      var self = this;
      var label = this.$('[name=dash-label]').val();
      if(this.dashboard)
        this.dashboard.save({label: label}, {wait: true, success: function() {
          self.close();
        }});
      else 
        this.collection.create({label: label}, {wait: true, success: function(dashboard) {          
          self.collection.setCurrentDashboard(dashboard);
          self.close();
        }})      
    },
    close: function(){
     this.$el.modal('hide');
    },
    shown: function(){
      this.$('[name=dash-label]').focus();
    },
    hidden: function(){
      this.dispose();
    },
    moveToTrash: function(){
      this.$('.move-to-trash-alert').slideDown();
    },
    moveToTrashCanceled: function(){
      this.$('.move-to-trash-alert').hide();
    },
    moveToTrashConfirmed: function(){
      console.log("move-to-trash")
    }
  });
  return EditDashboard;
});