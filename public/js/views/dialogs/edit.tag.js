define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',
  'views/view',  
  'text!templates/dialogs/edit.tag.text'  
], function($, _, Backbone, _state, AppView, template){
  var EditTag = AppView.extend({
    attributes : function (){
      return {
        class : 'modal hide fade',
        id : 'modal-edit-tag'
      }
    },  
    events: {
      "shown": "shown",
      "hidden": "hidden",
      "click .opt-save": "save",
      "click .opt-cancel": "close",
      "click .opt-move-to-trash": "moveToTrash",
      "click .opt-move-to-trash-no": "moveToTrashCanceled",
      "click .opt-move-to-trash-yes": "moveToTrashConfirmed",
      "submit .form-horizontal": "preventDefault",
      "keyup": "keypressed"
    }, 
    initializeView: function(options){ 
      this.editMode = options.editMode 
    },     
    renderView: function(){       
      var title = "Create tag";
      var showTrash = false;
      var optSaveLabel = "Create";
      var tag;
      if(this.editMode){
        title = "Edit tag";
        showTrash = true;
        optSaveLabel = "Save changes";
        tag = this.model;
      }
      var compiledTemplate = _.template(template, {
        tag: tag,
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
      var label = this.$('[name=tag-label]').val();
      if(this.editMode)
        this.model.save({
          label: label
        }, {wait: true, success: function() {
          self.close();
        }});
      else {
        var openContainer = this.$('[name=tag-open]').is(':checked');
        this.model.children.createTag({
          label: label,
          path: this.model.getFilter()
        }, {wait: true, success: function(tag) {  
          _state.addTag(tag);
          if(openContainer)
            self.trigger("tagAdded", tag);
          self.close();
        }}) 
      }     
    },
    close: function(){
     this.$el.modal('hide');
    },
    shown: function(){
      this.$('[name=tag-label]').focus();
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
    },
    preventDefault: function(event){
      event.preventDefault();
    },
    keypressed: function(event){
      if(event.keyCode === 13){
        $(".opt-save").click();
      }        
    }    
  });
  return EditTag;
});