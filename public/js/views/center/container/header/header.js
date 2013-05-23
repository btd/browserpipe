define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'text!templates/containers/header.text'
], function($, _, Backbone, AppView, template){
  var ContainerHeader = AppView.extend({
    tagName: 'div', 
    attributes : function (){
      return {
        class : 'header'
      }
    },    
    initializeView: function(){ 
      this.icon = this.options.icon;
      //Renders title if it changes
      var self = this;      
      this.listenTo(this.model, 'change:title', function(){          
        self.$('.title').html(self.model.get('title'));
      }); 
    },   
    renderView: function(){
      var compiledTemplate = _.template(template, {container: this.model, icon: this.icon});    
      $(this.el).html(compiledTemplate); 
      return this;
    }
  });
  return ContainerHeader;
});