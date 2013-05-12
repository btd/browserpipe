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
      Container.prototype.initializeView.call(this, options);
      //Add new events to existing ones      
      this.events["click .container-tag-icon"] = "navigateToParentTag";       
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
    renderItems: function(){
      var $items = $('<ul class="items"></ul>');      
      var items = this.model.tag.getItems();      
      for(index in items.models) {
          var containerItem = new ContainerItem({model: items.at(index)});
          $items.append(containerItem.render().el);
       };
      $('.box', this.el).append($items);
      return this;
    }, 
    postRender: function(){           
      Container.prototype.postRender.call(this);
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
    }
  });
  return TagContainer;
});