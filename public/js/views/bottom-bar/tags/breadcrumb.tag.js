define([
  'jQuery',
  'underscore',
  'backbone',
  'config',
  'models/state',
  'views/view',
  'views/dialogs/edit-tag',
  'views/bottom-bar/tags/breadcrumb.dropdown.tag',
  'text!templates/tags/breadcrumb.tag.text',
  'text!templates/tags/breadcrumb.dropdown.options.text'  
], function($, _, Backbone, config, _state, AppView, EditTag, BreadCrumbDropdownTag, tagTemplate, optionsTemplate){
  var BreadCrumbTag = AppView.extend({
    tagName: 'li',     
    dropdownOptionsTemplate: _.template(optionsTemplate),
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
      this.model.on('filterChanged', this.tagFilterChanged, this);
      this.model.get('children').on('change reset add remove', this.renderDropDown, this);
    },     
    renderView: function(){
      var compiledTemplate = _.template(tagTemplate, {tag: this.model});    
      $(this.el).html(compiledTemplate); 
      return this; 
    },
    postRender: function(){ 
      var self = this;
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
      if(!this.dropDownTagViews)
        this.renderDropDownView($dropdownMenu)
      $dropdownMenu.show();
      this.trigger("showDropDown", this.getTagFilter());
    },
    renderDropDownView: function($dropdownMenu){
      this.dropDownTagViews = [];          
      //Best collection interation: http://jsperf.com/backbone-js-collection-iteration/5          
      var columnsCount = 0;
      for (var i = 0, l = this.model.get('children').length; i < l; i++) {
        var $ul;
        //Add new column every time it reaches the max per column   
        if(i % config.DROPDOWN_TAGS_PER_COLUMN === 0){
          columnsCount++;
          $ul = $('<ul></ul');
          var $oneColumn = $('<li class="one-column"></li>');
          $oneColumn.append($ul);
          $dropdownMenu.append($oneColumn);
        }
        var childTag = this.model.get('children').models[i];            
        var $li = $('<li></li>');
        $ul.append($li); 
        var dropDownTagView = new BreadCrumbDropdownTag({model: childTag});
        this.dropDownTagViews.push(dropDownTagView);
        $li.append(dropDownTagView.render().el);            
      }
      //Inserts dropdwon options
      $dropdownMenu.append(this.dropdownOptionsTemplate);
      //Sets dropdown width
      this.setDropDownWidth(columnsCount);
    },
    clearDropDown: function($dropdownMenu){
      $dropdownMenu.empty();
      for(index in this.dropDownTagViews)
        this.dropDownTagViews[index].dispose();
    },
    setDropDownWidth: function(columnsCount){
      var width = columnsCount * config.DROPDOWN_COLUMN_WIDTH;
      this.$('.dropdown-menu').width(width);
    },
    hideDropDown: function(){
      if(this.dropDownTagViews)     
        this.$(".dropdown-menu").hide(); 
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
      editTag.on('tagAdded', function(tag){
        //We have to call it to make sure it is set before creating the container
        _state.addTag(tag);
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
      var $dropdownMenu = this.$(".dropdown-menu");
      this.clearDropDown($dropdownMenu);
      this.renderDropDownView($dropdownMenu);
    }
  });
  return BreadCrumbTag;
});