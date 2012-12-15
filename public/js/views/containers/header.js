define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'text!templates/containers/header.text'
], function($, _, Backbone, AppView, template){
  var ContainerHeader = AppView.extend({
    name: 'ContainerHeader',
    tagName: 'div', 
    attributes : function (){
      return {
        class : 'header'
      }
    },    
    initializeView: function(){     
      this.container = this.options.container;
      this.icon = this.options.icon;
      this.menuOptions = this.options.menuOptions;
    },   
    renderView: function(){
      var compiledTemplate = _.template( template, {container: this.container, icon: this.icon, options: this.menuOptions} );    
      $(this.el).html(compiledTemplate); 
      return this;
    },
    triggerEvent: function(eventName){
      this.trigger(eventName)
    },
    showOptionsToggle: function(){
      $('.options .dropdown-toggle', this.el).css('display', 'block');
    },
    hideOptionsToggle: function(){
      $('.options').removeClass('open');
      $('.options .dropdown-toggle', this.el).hide();
    }
  });
  return ContainerHeader;
});