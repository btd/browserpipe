define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'text!templates/tags/menu.item.text'
], function($, _, Backbone, App_View, template){
  var TagsMenuItemView = App_View({
    tagName: 'li', 
    attributes : function (){
      return {
        class : 'menu-tag',
        id : "tag_" + this.model.get('_id')
      }
    }, 
    initialize: function(){ 
      this.model.view = this;
      this.model.on('change', this.render, this);           
      this.model.bind("destroy", this.close, this);   
    },
    events: {
      "click":"selectTag",
    },
    selectTag:function (event){
      this.model.set({selected: true})          
    },
    renderview: function(){ 
      var compiledTemplate = _.template( template, {tag: this.model} );      
      $(this.el).html(compiledTemplate);      
      this.setActiveClass();
      return this;
    },
    close:function () {
      $(this.el).unbind();
      $(this.el).remove();
    },
    setActiveClass: function(){
      if(this.model.get('selected'))
        $(this.el).addClass("active");
      else
        $(this.el).removeClass("active");
    }
  });
  return TagsMenuItemView;
});
