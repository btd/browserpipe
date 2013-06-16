var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var AppView = require('views/view');
var template = require('templates/tags/tags.editor.tag');
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
  module.exports = TagsEditorTag;
