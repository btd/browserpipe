define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',
  'views/view',  
  'text!templates/tags/tags.editor.tag.text'  
], function($, _, Backbone, _state, AppView, template){
  var TagsEditorTag = AppView.extend({    
    attributes : function (){
      return {
        class : 'tags-editor-tag'
      }
    },  
    events: {
      "click .close": "removeTag"
    }, 
    initializeView: function(){ 
    },     
    renderView: function(){       
      var filter = this.model.getFilter();
      var compiledTemplate = _.template(template, {
        label: filter.substring(5, filter.length)
      });    
      this.$el.html(compiledTemplate);
      return this;    
    },
    removeTag: function(e){      
      this.trigger('tagRemoved', this.model);
      this.dispose();      
    }
  });
  return TagsEditorTag;
});