define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'views/tags/breadcrumb.dropdown.tag',
  'text!templates/tags/breadcrumb.tag.text'  
], function($, _, Backbone, AppView, BreadCrumbDropdownTag, template){
  var BreadCrumbTag = AppView.extend({
    name: 'BreadCrumbTag',
    tagName: 'li',     
    events: {
      "mouseenter" : "showDropDown",
      "mouseleave" : "hideDropDown",
      "mouseenter .children" : "navigateToChilds",
      "mouseleave .children" : "stopNavigateToChilds",
      "click .item" : "selectTag",
      "click .name" : "selectChildTag"
    },
    attributes : function (){
      return {
        class : 'tag-breadcrumb dropdown',
        //TODO: This should have a real id 
        id : "tag-breadcrumb" + Math.random()
      }
    },    
    initializeView: function(){ 
      this.tag = this.options.tag;
      this.opened = this.options.opened;
    },     
    renderView: function(){
      var compiledTemplate = _.template(template, {tag: this.tag});    
      $(this.el).html(compiledTemplate); 
      return this; 
    },
    postRender: function(){ 
      var self = this;
      //As not all browsers support HTML5, we set data attribute by Jquery
      jQuery.data(this.el, 'path', this.getTagFullPath());
      this.centerArrow();      
      if(this.opened)            
        this.showDropDown();
      $(window).resize(function() {     
        self.calculateDropDownHeight();
      });
    },
    getTagPath: function(){      
      return this.tag.get('path');
    },
    getTagFullPath: function(){
      return (this.tag.get('isRoot')?"":this.tag.get('path') + ".") + this.tag.get('label');
    },
    calculateDropDownHeight: function(){
      var wheight = $(window).height();
      var value = wheight - 70;            
      $(".tag-dropdown", this.el).css("max-height", value);
    },
    showDropDown: function(){      
      if(this.tag.get('children').length > 0){        
        if(!this.breadCrumbDropdownTags){
          this.breadCrumbDropdownTags = [];
          var $table = $(".tag-dropdown-childs" , this.el);
          //Best collection interation: http://jsperf.com/backbone-js-collection-iteration/5
          for (var i = 0, l = this.tag.get('children').length; i < l; i++) {
            var childTag = this.tag.get('children').models[i];            
            var $tr = $('<tr></tr>');
            $table.append($tr); 
            var breadCrumbDropdownTag = new BreadCrumbDropdownTag({tag: childTag});
            this.breadCrumbDropdownTags.push(breadCrumbDropdownTag);
            $tr.append(breadCrumbDropdownTag.render().el);            
          }
        }
        //Calculates the height of the dropdown
        this.calculateDropDownHeight();
        $(".tag-dropdown-cont" , this.el).show();
        this.trigger("showDropDown", this.getTagPath());
      }
    },
    hideDropDown: function(){
      if(this.breadCrumbDropdownTags){        
        $(".tag-dropdown-cont" , this.el).hide(); 
      }
    },
    centerArrow: function(){
      //Position arrow of dropdown in the middle
      var left = ($(this.el).width() - 10) / 2;      
      if(left > 80)
          left = 40;
      $(".tag-dropdown-arrow", this.el).css("left", left)             
    },
    navigateToChilds: function(e){
      var self = this;
      var path = jQuery.data($(e.target).parent().get(0), 'path');
      this.timeout = setTimeout(function() { 
        //Triggers the event
        self.trigger('startNavigateToChild', path);
      }, 350);
    },
    stopNavigateToChilds: function(){
      clearTimeout(this.timeout);  
    },
    selectTag: function(e){ 
      var path = jQuery.data($(e.target).parents('.tag-breadcrumb').get(0), 'path');
      this.trigger('selectChild', path); 
    },
    selectChildTag: function(e){  
      e.preventDefault();
      var path = jQuery.data($(e.target).parent().get(0), 'path');
      this.trigger('selectChild', path);
    }

  });
  return BreadCrumbTag;
});