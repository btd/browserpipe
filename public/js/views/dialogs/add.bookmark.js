define([
  'jQuery',
  'underscore',
  'backbone',
  'util',
  'models/state',
  'models/item',
  'views/view',  
  'text!templates/dialogs/add.bookmark.text'  
], function($, _, Backbone, util, _state, Item, AppView, template){
  var AddBookmark = AppView.extend({
    attributes : function (){
      return {
        class : 'modal hide fade',
        id : 'modal-add-bkmkr'
      }
    },  
    events: {
      "shown": "shown",
      "hidden": "hidden",
      "click .opt-save": "save",
      "click .opt-cancel": "close",
      "submit .form-horizontal": "preventDefault",
      "keyup": "keypressed"
    }, 
    initializeView: function(options){ 
      this.tag = options.tag;
    },     
    renderView: function(){          
      var compiledTemplate = _.template(template, {
        bookmark: this.model,
        tag: this.tag
      });    
      this.$el.html(compiledTemplate).appendTo('#dialogs').modal('show');
      return this;    
    },
    postRender: function(){

    },
    save: function(){
      var self = this;
      this.cleanErrors();      
      var title = this.$('[name=bkmrk-title]').val();
      var url = this.$('[name=bkmrk-url]').val();
      var note = this.$('[name=bkmrk-note]').val();
      var tags = _.map(this.$('[name=bkmrk-tags]').val().split(','), function(tag){ 
        return $.trim(tag)
      });      
      this.validateFields(url);
      if(!this.hasErrors()){
        //We append current tag filter
        tags.push(this.tag.getFilter());
        //We create the tag
        var item = new Item();
        item.save({
          type: 0,
          tags: _.compact(_.uniq(tags)), //no blanks and non repeated
          title: title,
          url: url,
          note: note
        }, {wait: true, success: function(bookmark) {                    
          _state.addItemToTags(bookmark);
          self.close();
        }})          
      }
    },
    cleanErrors: function(){
      this.unSetAllErrorFields(this.$("#bkmrk-url"));
    },
    validateFields: function(url){
      if(url=="")
        this.setErrorField(this.$("#bkmrk-url"), this.$("#bkmrk-url-blank"));                
      else 
        if(!util.isValidURL(url))
          this.setErrorField(this.$("#bkmrk-url"), this.$("#bkmrk-url-invalid"));  
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
  return AddBookmark;
});