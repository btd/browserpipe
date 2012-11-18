define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',
  'views/containers/container',
  'views/tags/container.child.tag',
  'data/containers'
], function($, _, Backbone, _state, Container, ContainerChildTag, ContainersData, TagsData){
  var TagContainer = Container.extend({
    name: 'TagContainer',
  	icon: 'img/tag.png', 
    events: {
      "click" : "select", //TODO: maybe there is a better way to avoid repeating parent event
      "click .collapser" : "toggle"
    },
    initializeView: function(){           
      this.container = this.options.container; //TODO: call parent container intializeView method
      this.collapsed = !this.container.tag.get('isRoot');
    },
  	renderView: function(){
  	  this
        .renderHeader()
  	    .renderChildsTags()
        .renderItems();
      return this; 
    },
    renderChildsTags: function(){      
      var tag = this.container.tag;      
	  	var $tags = $('<ul class="tags ' + (this.collapsed?' collapsed':'') + '">'+ (this.container.tag.get('isRoot')?'':'<li class="collapser"></li>') + '</ul>');
	  	$('.box', this.el).append($tags);
      //Render navigate to parent (...) except for root tag
      if(!tag.get('isRoot'))    	  	
	  	  this.renderChildTag($tags, tag, tag.get('path'), '...');
	  	//Render childs tags
      for (var i = 0, l = tag.get('children').length; i < l; i++) {       	
        var childTag = tag.get('children').models[i];   
  	  	var path = (tag.get('isRoot')?"":tag.get('path') + ".") + tag.get('label') + "." + childTag.get('label');	  	  	
      	this.renderChildTag($tags, tag, path, childTag.get('label'));  
      };
	    return this;
    },
    renderChildTag: function($tags, tag, path, title){
    	var self = this;    	
    	var cct = new ContainerChildTag({title: title, path: path});
      $tags.append(cct.render().el);
      cct.on('navigateToTag', 
	      function(path){  	      	
	      	//TODO: erase, generate fake data
	       	var fakeDataContainer = new ContainersData();
	       	
          _state.getTag(path, {
              success: function(childTag){                 
                self.container.name = path;
                self.container.tag = childTag;  
                self.container.items = [];                      
                var numberOfItems = Math.floor(Math.random() * 50);         
                for (var i = 0; i < numberOfItems; i++) {
                    self.container.items.push(fakeDataContainer.getRandomItem());
                };
                self.clean();
                self.renderView();
                self.calculateHeight();      
              }, 
              error: function(err){        
                //TODO: manage the error
                console.log(err)
              }
           });
							
	        
	      }
	    );
    },
    toggle: function(){
      if(!this.container.tag.get('isRoot')){
        var $tags = $('.tags', this.el);
        if($tags.hasClass('collapsed')){
          this.collapsed = false;
          $tags.removeClass('collapsed')
        }
        else{
          this.collapsed = true;
          $tags.addClass('collapsed')
        }
      }
    }
  });
  return TagContainer;
});