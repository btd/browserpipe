define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',  
  'views/center/container/container',  
  'views/center/container/header/tag.header',
  'views/center/container/tag/child.tag'
], function($, _, Backbone, _state, Container, TagContainerHeader, ContainerChildTag, ContainersData){
  var TagContainer = Container.extend({
    collapsed:  false,
    initializeView: function(options){        
      Container.prototype.initializeView.call(this);
      //Add new events to existing ones      
      this.events["click .container-tag-icon"] = "navigateToParentTag";
      //Add options for the menu
      this.addMenuOptions([
        {name: "menu_option_showNavigation", label: "Show Navigation", method: "showNavigation"},
        {name: "menu_option_changeName", label: "Edit", method: "editTag"}
      ]);  
    },
  	renderView: function(){
  	  this
        .renderMenuOptions()
        .renderHeader()
        .renderBox()
  	    .renderChildsTags()
        .renderItems();
      return this; 
    },  
    renderHeader: function(){        
      this.header = new TagContainerHeader({model: this.model, icon: this.icon});                                               
      $(this.el).append(this.header.render().el); 
      return this;
    },
    renderChildsTags: function(){      
	  	var $tags = $('<ul class="tags ' + (this.collapsed?' collapsed':'') + '"></ul>');
	  	$('.box', this.el).append($tags);
	  	//Render childs tags
      for (var i = 0, l = this.model.tag.get('children').length; i < l; i++) {       	
        var childTag = this.model.tag.get('children').models[i];   
      	this.renderChildTag($tags, childTag);  
      };
	    return this;
    },
    renderChildTag: function($tags, childTag){
    	var self = this;    	
    	var cct = new ContainerChildTag({tag: childTag});
      $tags.append(cct.render().el);
      cct.on('navigateToTag', this.navigateToTag, this);
    },
    navigateToTag: function(tag){        
      //Sets the new tag
      this.model.set('title', tag.get('label'));
      this.model.set('filter', tag.getFilter());
      this.model.save();
      this.model.tag = tag;
      //Clears content
      this.clean();
      //Render the view again
      this.render();      
      //Sets as the current container      
      _state.dashboards.setCurrentContainer(this.model.get('_id'));
    },
    navigateToParentTag: function(){      
      var parent = _state.getTagByFilter(this.model.tag.get('path'));
      if(parent)
        this.navigateToTag(parent);
    },
    toggle: function(){
      /*var $tags = $('.tags', this.el);
      if($tags.hasClass('collapsed')){
        this.collapsed = false;
        $tags.removeClass('collapsed')
      }
      else{
        this.collapsed = true;
        $tags.addClass('collapsed')
      }*/
    },
    showNavigation: function(options){      
      /*options.self.toggle();
      options.e.stopPropagation();*/
    },
    editTag: function(){
      
    }
  });
  return TagContainer;
});