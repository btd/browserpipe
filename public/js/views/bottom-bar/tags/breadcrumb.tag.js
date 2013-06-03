define([
  'jQuery',
  'underscore',
  'backbone',
  'config',
  'models/state',
  'views/view',
  'views/dialogs/edit.tag',
  'views/bottom-bar/tags/breadcrumb.dropdown.tag',
  'text!templates/tags/breadcrumb.tag.text' 
], function($, _, Backbone, config, _state, AppView, EditTag, BreadCrumbDropdownTag, tagTemplate){
  var BreadCrumbTag = AppView.extend({
    tagName: 'li', 
    events: {
      "mouseenter" : "showDropDown",
      "mouseleave" : "hideDropDown",
      "mouseenter .children" : "startNavigateToChildTag",
      "mouseleave .children" : "stopNavigateToChildTag",
      "click .item" : "openTagContainer",
      "click .dropdown_tag" : "selectChildTag",
      "click .dropdown-add-tag" : "addTagOption",
      "click .dropdown-edit-tag" : "editTagOption"
    },
    attributes : function (){
      return {
        class : 'tag-breadcrumb dropdown',
        id : "tag_bread_" + this.model.get('_id')
      }
    },    
    initializeView: function(){ 
      this.opened = this.options.opened;
      this.listenTo(this.model, 'filterChanged', this.tagFilterChanged);
      this.listenTo(this.model.children, 'change reset add remove', this.renderDropDown);
    },     
    renderView: function(){
      var compiledTemplate = _.template(tagTemplate, {tag: this.model});    
      $(this.el).html(compiledTemplate); 
      return this; 
    },
    postRender: function(){ 
      var self = this;
      $(window).resize(function() {
        self.renderDropDown();
      });
      //As not all browsers support HTML5, we set data attribute by Jquery
      jQuery.data(this.el, 'filter', this.model.getFilter());
      if(this.opened)            
        this.showDropDown();
    },
    getTagFilter: function(){      
      return this.model.getFilter();
    },
    showDropDown: function(){            
      var $dropdownMenu = this.$(".dropdown-menu");
      $dropdownMenu.siblings('.item').addClass('selected');
      if(!this.dropDownTagViews)
        this.renderDropDownView(this.$('.dropdown-menu-tags'))
      $dropdownMenu.show();
      this.trigger("showDropDown", this.getTagFilter());
    },
    hideDropDown: function(){
      var $dropdownMenu = this.$(".dropdown-menu");
      $dropdownMenu.siblings('.item').removeClass('selected');
      if(this.dropDownTagViews)     
        $dropdownMenu.hide(); 
    },  
    renderDropDownView: function($dropdownMenuTags){
      this.dropDownTagViews = [];         
      //Calculate max columns
      var windowWidth = $(window).width();    
      var columns = Math.floor((windowWidth  * 0.7) / config.DROPDOWN_COLUMN_WIDTH); //0.7 to not get all screen
      //Calculate tags per column
      var tagsPerColumn = Math.ceil(this.model.children.length / columns)
      //If tags per column is less than a min, then we set the min
      if(tagsPerColumn < config.MIN_DROPDOWN_TAGS_PER_COLUMN) 
        tagsPerColumn = config.MIN_DROPDOWN_TAGS_PER_COLUMN;
      //Best collection interation: http://jsperf.com/backbone-js-collection-iteration/5          
      var columnsCount = 0;
      for (var i = 0, l = this.model.children.length; i < l; i++) {
        var $ul;
        //Add new column every time it reaches the max per column   
        if(i % tagsPerColumn === 0){
          columnsCount++;
          $ul = $('<ul></ul');
          var $oneColumn = $('<li class="one-column"></li>');
          $oneColumn.append($ul);
          $dropdownMenuTags.append($oneColumn);
        }
        var childTag = this.model.children.models[i];            
        var $li = $('<li></li>');
        $ul.append($li); 
        var dropDownTagView = new BreadCrumbDropdownTag({model: childTag});
        this.dropDownTagViews.push(dropDownTagView);
        $li.append(dropDownTagView.render().el);            
      }
      //Sets dropdown width
      this.setDropDownWidth(columnsCount);
      //Sets dropdown width
      this.setDropDownMaxHeight();
      //Positions the arrow
      this.setArrowPosition();
    },
    clearDropDown: function($dropdownMenuTags){
      $dropdownMenuTags.empty();
      for(index in this.dropDownTagViews)
        this.dropDownTagViews[index].dispose();
    },
    setDropDownWidth: function(columnsCount){
      var width = columnsCount * config.DROPDOWN_COLUMN_WIDTH + 20; //20px for scrollbar
      this.$('.dropdown-menu-tags').width(width);
    },
    setDropDownMaxHeight: function(){
      var windowHeight = $(window).height();    
      this.$('.dropdown-menu-tags').css({
        'max-height': Math.floor(windowHeight * 0.7)
      });;
    },
    setArrowPosition: function(){
      var bodyWidth= $('body').width();    
      var dropDownWidth = this.$('.dropdown-menu').width();          
      var left = this.$('.dropdown-menu').parent().position().left;
      //console.log(this.$('.dropdown-menu').css('left'));
      if((left + dropDownWidth) > bodyWidth){
        var newLeft = 1- (dropDownWidth - (bodyWidth - left))        
        this.$('.dropdown-menu').css({
        'left': newLeft
        });
        this.$('.dropdown-menu').css({
        'left': newLeft
        });
      }
    },  
    startNavigateToChildTag: function(e){
      var self = this;
      var filter = jQuery.data($(e.target).parent().get(0), 'filter');
      this.timeout = setTimeout(function() {         
        //Triggers the event
        self.trigger('startNavigateToChildTag', filter);
      }, 350);
    },
    stopNavigateToChildTag: function(){
      clearTimeout(this.timeout);  
    },
    openTagContainer: function(e){   
      e.preventDefault();          
      this.createContainerFromTag(this.model);
    },
    selectChildTag: function(e){  
      e.preventDefault();
      var filter = jQuery.data($(e.target).get(0), 'filter');
      var tag = _state.getTagByFilter(filter);  
      this.createContainerFromTag(tag);     
    },
    createContainerFromTag: function(tag){
      var container =_state.dashboards.getCurrentDashboard().addContainer({
        "filter": tag.getFilter(),
        "order": 0, //TODO: manage order
        "title": tag.get('label'),
        "type":1
      },{wait: true, success: function(container) { 
        _state.dashboards.setCurrentContainer(container.get('_id'));
      }});  
    },
    addTagOption: function(){
      var self = this;
      var editTag = new EditTag({model: this.model, editMode: false});
      this.listenTo(editTag, 'tagAdded', function(tag){        
        //Create container
        self.createContainerFromTag(tag);
      });
      editTag.render();            
      this.hideDropDown();
    },
    editTagOption: function(){
      var editTag = new EditTag({model: this.model, editMode: true});
      editTag.render();  
      this.hideDropDown();    
    },
    tagFilterChanged: function(){    
      //Renders everything again
      this.render();
      this.renderDropDown();
    },
    renderDropDown: function(){
      //Renders dropdown again
      var $dropdownMenuTags = this.$(".dropdown-menu-tags");
      this.clearDropDown($dropdownMenuTags);
      this.renderDropDownView($dropdownMenuTags);
    }
  });
  return BreadCrumbTag;
});