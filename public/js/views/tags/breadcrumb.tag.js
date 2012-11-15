define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'views/tags/breadcrumb.dropdown.tag',
  'data/tags',  
  'text!templates/tags/breadcrumb.tag.text'  
], function($, _, Backbone, AppView, BreadCrumbDropdownTag, tagsData, template){
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
      //TODO: Remove fake initial containers to test html/css design
      this.fakeData  = new tagsData();    
    },     
    renderView: function(){
      var compiledTemplate = _.template(template, {tag: this.tag});    
      $(this.el).html(compiledTemplate); 
      return this; 
    },
    postRender: function(){ 
      var self = this;
      //As not all browsers support HTML5, we set data attribute by Jquery
      jQuery.data(this.el, 'path', this.getTagPath());
      this.centerArrow();      
      if(this.opened)            
        this.showDropDown();
      $(window).resize(function() {     
        self.calculateDropDownHeight();
      });
    },
    getTagPath: function(){      
      return (this.tag.path != ""?this.tag.path + ".":"") + this.tag.name
    },
    calculateDropDownHeight: function(){
      var wheight = $(window).height();
      var value = wheight - 70;            
      $(".tag-dropdown", this.el).css("max-height", value);
    },
    showDropDown: function(){
      if(this.tag.children){        
        if(!this.breadCrumbDropdownTags){
          this.breadCrumbDropdownTags = [];
          var $table = $(".tag-dropdown-childs" , this.el);
          for (index in this.tag.children) {
            var childTagPath = this.tag.children[index].name;
            
            //If tag is not root then we attach the rest of the path
            if(!this.tag.isRoot){
              childTagPath = this.getTagPath() + "."  + childTagPath;  
            }
            var childTag = this.fakeData.getTag(childTagPath);
            var $tr = $('<tr></tr>');
            $table.append($tr); 
            /*if (index % 3 == 0) {
                $tr = $('<tr></tr>');
                $table.append($tr);
            }*/       
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
      if(!this.tag.isRoot){
        var path = jQuery.data($(e.target).parents('.tag-breadcrumb').get(0), 'path');
        this.trigger('selectChild', path);
      }
    },
    selectChildTag: function(e){  
      e.preventDefault();
      var path = jQuery.data($(e.target).parent().get(0), 'path');
      this.trigger('selectChild', path);
    }

  });
  return BreadCrumbTag;
});