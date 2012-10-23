/*define([
  'jQuery',
  'underscore',
  'backbone',
  'text!templates/folders/menu.add.text'
], function($, _, Backbone, template){
  var FoldersMenuAddView = Backbone.View.extend({
  	tagName: 'div', 
    attributes : function (){
      return {
        class : 'menu-folder',
        id : "folder_" + this.model.get('_id')
      }
    },    
    initialize: function(){ 
      this.model.view = this;
      
    }
  });
  return FoldersMenuAddView;
});*/