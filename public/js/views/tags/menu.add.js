/*define([
  'jQuery',
  'underscore',
  'backbone',
  'text!templates/tags/menu.add.text'
], function($, _, Backbone, template){
  var TagsMenuAddView = Backbone.View.extend({
  	tagName: 'div', 
    attributes : function (){
      return {
        class : 'menu-tag',
        id : "tag_" + this.model.get('_id')
      }
    },    
    initialize: function(){ 
      this.model.view = this;
      
    }
  });
  return TagsMenuAddView;
});*/