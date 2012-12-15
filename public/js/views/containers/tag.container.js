define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',
  'views/containers/container',  
  'views/containers/tag.header',
  'views/tags/container.child.tag',
  'data/containers'
], function($, _, Backbone, _state, Container, TagContainerHeader, ContainerChildTag, ContainersData, TagsData){
  var TagContainer = Container.extend({
    name: 'TagContainer',
    collapsed:  false,
    initializeView: function(){           
      Container.prototype.initializeView.call(this);
     /* this.addEvents({
        "click .collapser" : "toggle"
      });*/
      this.addMenuOptions([
        {name: "menu_option_showNavigation", label: "Show Navigation", method: "showNavigation"},
        {name: "menu_option_changeName", label: "Change Name", method: "changeName"},
        {name: "menu_option_delete", label: "Delete", method: "deleteTag"}
      ]);  
    },
  	renderView: function(){
  	  this
        .renderHeader()
        .renderBox()
  	    .renderChildsTags()
        .renderItems();
      return this; 
    },  
    renderHeader: function(){        
      this.containerHeader = new TagContainerHeader({container: this.container, icon: this.icon, menuOptions: this.menuOptions});                     
      this.renderMenuOptions();
      return this;
    },
    postRender: function(){
      Container.prototype.postRender.call(this);
      this.containerHeader.on('navigateToTag', this.navigateToTag, this);
    },
    renderChildsTags: function(){      
      var tag = this.container.tag;      
	  	var $tags = $('<ul class="tags ' + (this.collapsed?' collapsed':'') + '"></ul>');
	  	$('.box', this.el).append($tags);
	  	//Render childs tags
      for (var i = 0, l = tag.get('children').length; i < l; i++) {       	
        var childTag = tag.get('children').models[i];   
  	  	var path = tag.getFullPath() + "." + childTag.get('label');	  	  	
      	this.renderChildTag($tags, tag, path, childTag);  
      };
	    return this;
    },
    renderChildTag: function($tags, tag, path, childTag){
    	var self = this;    	
    	var cct = new ContainerChildTag({tag: childTag});
      $tags.append(cct.render().el);
      cct.on('navigateToTag', this.navigateToTag, this);
    },
    toggle: function(){
      var $tags = $('.tags', this.el);
      if($tags.hasClass('collapsed')){
        this.collapsed = false;
        $tags.removeClass('collapsed')
      }
      else{
        this.collapsed = true;
        $tags.addClass('collapsed')
      }
    },
    showNavigation: function(options){      
      options.self.toggle();
      options.e.stopPropagation();
    },
    navigateToTag: function(tag){  
      //TODO: erase, generate fake data
      var fakeDataContainer = new ContainersData();
      this.container.name = tag.get('path');
      this.container.tag = tag;  
      this.container.items = [];                      
      var numberOfItems = Math.floor(Math.random() * 50);         
      for (var i = 0; i < numberOfItems; i++) {
          this.container.items.push(fakeDataContainer.getRandomItem());
      };
      this.clean();
      this.render();
      this.calculateHeight(); 
      this.trigger("navigatedToTag", tag);  
    }
  });
  return TagContainer;
});