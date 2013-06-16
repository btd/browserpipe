var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var AppView = require('views/view');
var template = require('templates/tags/breadcrumb.dropdown.tag');
  var BreadCrumbDropdownTag = AppView.extend({
    name: 'BreadCrumbDropdownTag',
    tagName: 'a', 
    events: {
      "mouseenter" : "showChildrenOption",
      "mouseleave" : "hideChildrenOption",
    },
    attributes : function (){
      return {
        class: "dropdown_tag",
        id : "dropdown_tag_" + this.model.get('_id')
      }
    },    
    initializeView: function(){ 
    },     
    renderView: function(){
      var compiledTemplate = _.template( template, {tag: this.model} );    
      $(this.el).html(compiledTemplate);       
      return this; 
    },
    postRender: function(){   
      //As not all browsers support HTML5, we set data attribute by Jquery            
      jquery.data(this.el, 'filter', this.model.getFilter());
    },
    showChildrenOption: function(){
      this.$(".children").show(); 
    },
    hideChildrenOption: function(){
      this.$(".children").hide(); 
    } 
  });
  module.exports = BreadCrumbDropdownTag;
