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
      "click .opt-save" : "save",
      "click .opt-cancel" : "close"
    }, 
    initializeView: function(options){ 
      this.dashboard = options.dashboard;
    },     
    renderView: function(){                    
      var compiledTemplate = _.template(template, {dashboard: this.dashboard});    
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
    },
    hidden: function(){
      this.dispose();
    }
  });
  return EditDashboard;
});