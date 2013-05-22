define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',  
  'views/center/container/container',  
  'views/center/container/tag/child.tag',
  'views/center/container/item/item'
], function($, _, Backbone, _state, Container, ContainerChildTag, ContainerItem){
  var TagContainer = Container.extend({
    collapsed:  false,
    initializeView: function(options){    
      var self = this;
      Container.prototype.initializeView.call(this, options);
      //Add new events to existing ones      
      this.events["click .container-tag-icon"] = "navigateToParentTag";                   
      //Listen to tag events
      this.listenTagEvents();
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
    renderChildsTags: function(){      
	  	var $tags = $('<ul class="tags ' + (this.collapsed?' collapsed':'') + '"></ul>');
	  	$('.box', this.el).append($tags);
	  	//Render childs tags      
      for (var i = 0, l = this.model.tag.children.length; i < l; i++) {       	
        var childTag = this.model.tag.children.models[i];   
      	this.renderChildTag(childTag);  
      };
	    return this;
    },
    renderChildTag: function(childTag){
      var $tags = this.$('.tags');
    	var cct = new ContainerChildTag({tag: childTag});
      $tags.append(cct.render().el);
      cct.on('navigateToTag', this.navigateToTag, this);
    },
    renderItems: function(){
      var $items = $('<ul class="items"></ul>');      
      var items = this.model.tag.getItems();      
      for(index in items.models) {
          this.renderItem(items.at(index));
       };
      $('.box', this.el).append($items);
      return this;
    }, 
    renderItem: function(item){
      var $items = this.$('.items');
      var containerItem = new ContainerItem({model: item});
      $items.append(containerItem.render().el);
    },  
    postRender: function(){           
      Container.prototype.postRender.call(this);
    },
    listenTagEvents: function(){  
      var self = this;
      //If an item is added, we render it
      this.model.tag.children.on('add', this.renderChildTag, this);
      //If an item is added, we render it
      this.model.tag.getItems().on('add', this.renderItem, this);
    },
    navigateToTag: function(tag){           
      //Unbind old tag events
      this.model.tag.children.off('add', this.renderChildTag, this);
      this.model.tag.getItems().off('add', this.renderItem, this)
      //Sets the new tag
      this.model.set('title', tag.get('label'));
      this.model.set('filter', tag.getFilter());
      this.model.save();
      this.model.tag = tag;
      //Listen to new tag events
      this.listenTagEvents();
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
    }
  });
  return TagContainer;
});