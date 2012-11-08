define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'text!templates/tags/add.edit.text'
], function($, _, Backbone, AppView, template){
  var TagsAddEditView = AppView.extend({
    name: 'TagsAddEditView',
  	tagName: 'div', 
    attributes : function (){
      return {
        class : 'menu-tag',
        id : "tag_" + this.model.get('_id')
      }
    },    
    initializeView: function(){ 
      this.model.view = this;
      
    }
  });
  return TagsAddEditView;
});