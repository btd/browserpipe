define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',
  'views/view',  
  'text!templates/dialogs/view.bookmark.text'  
], function($, _, Backbone, _state, AppView, template){
  var ViewBookmark = AppView.extend({
    attributes : function (){
      return {
        class : 'modal hide fade',
        id : 'modal-view-bkmkr'
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
    initializeView: function(){ 
    },     
    renderView: function(){   
      var compiledTemplate = _.template(template, {
        bookmark: this.model
      });    
      this.$el.html(compiledTemplate).appendTo('#dialogs').modal('show');
      return this;    
    },
    postRender: function(){

    },
    save: function(){
      var self = this;
      var title = this.$('[name=bkmrk-title]').val();
      var url = this.$('[name=bkmrk-url]').val();
      var note = this.$('[name=bkmrk-note]').val();
      var tags = _.map(this.$('[name=bkmrk-tags]').val().split(','), function(tag){ 
        return $.trim(tag)
      });      
      this.model.save({
        title: title,
        url: url,
        note: note,
        tags: _.compact(_.uniq(tags))
      }, {wait: true, success: function() {
        self.close();
      }});         
    },
    close: function(){
     this.$el.modal('hide');
    },
    shown: function(){
      this.$('[name=bkmrk-url]').focus();
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
  return ViewBookmark;
});