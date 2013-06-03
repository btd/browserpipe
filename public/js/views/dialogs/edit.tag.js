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
      var editMode = false;
      var optSaveLabel = "Create";
      var tag;
      if(this.editMode){
        title = "Edit tag";
        editMode = true;
        optSaveLabel = "Save changes";
        tag = this.model;
      }
      var compiledTemplate = _.template(template, {
        tag: tag,
        title: title,
        editMode: editMode,
        optSaveLabel: optSaveLabel
      });    
      this.$el.html(compiledTemplate).appendTo('#dialogs').modal('show');
      return this;    
    },
    postRender: function(){

    },
    save: function(){
      var self = this;
      this.cleanErrors();
      var label = $.trim(this.$('[name=tag-label]').val());
      this.validateFields(label);
      if(!this.hasErrors())
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
          }).then(function(tag) {  
            _state.addTag(tag);
            if(openContainer)
              self.trigger("tagAdded", tag);
            self.close();
          });
        }     
    },
    cleanErrors: function(){
      this.unSetAllErrorFields(this.$("#tag-label"));
    },
    validateFields: function(label){
      if(label=="")
        this.setErrorField(this.$("#tag-label"), this.$("#tag-label-blank"));
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
        event.preventDefault();
        //If enter inside form, we submit it
        if($(event.target).parents('.form-horizontal').length > 0){
          $(".opt-save").click();
        }
      }        
    }    
  });
  return EditTag;
});