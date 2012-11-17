define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'text!templates/tags/breadcrumb.dropdown.tag.text'  
], function($, _, Backbone, AppView, template){
  var BreadCrumbDropdownTag = AppView.extend({
    name: 'BreadCrumbDropdownTag',
    tagName: 'td', 
    attributes : function (){
      return {
        class : 'tag-dropdown-child',
        //TODO: This should have a real id 
        id : "tag-dropdown-child" + Math.random()
      }
    },    
    initializeView: function(){    
      this.tag = this.options.tag;
    },     
    renderView: function(){
      var compiledTemplate = _.template( template, {tag: this.tag} );    
      $(this.el).html(compiledTemplate);       
      return this; 
    },
    postRender: function(){   
      //As not all browsers support HTML5, we set data attribute by Jquery            
      jQuery.data(this.el, 'path', this.tag.get('path') + "." + this.tag.get('label'));  
    }   
  });
  return BreadCrumbDropdownTag;
});