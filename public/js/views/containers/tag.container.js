define([
  'jQuery',
  'underscore',
  'backbone',
  'views/containers/container',
  'views/tags/container.child.tag',
  'data/containers',
  'data/tags'
], function($, _, Backbone, Container, ContainerChildTag, ContainersData, TagsData){
  var TagContainer = Container.extend({
    name: 'TagContainer',
  	icon: 'img/tag.png', 
  	renderView: function(){
  	  this.renderHeader();
  	  this.renderChildsTags();
      this.renderItems();
      return this; 
    },
    renderChildsTags: function(){      
      var tag = this.container.tag;
      if(tag.path != "" || this.container.tag.children){
  	  	var $tags = $('<ul class="tags"></ul>');
  	  	$('.box', this.el).append($tags);  
  	  	//Render navigate to parent (...)
  	  	if(tag.path != ""){
  	  		this.renderChildTag($tags, tag, tag.path, '...');
  	  	}  	  		
  	  	//Render childs
  	  	if(this.container.tag.children)        	
	  	  for (index in this.container.tag.children) {
	  	  	var child = this.container.tag.children[index];
	  	  	var path = (tag.path != ""?tag.path + ".":"") + tag.name + "." + child.name;	  	  	
	      	this.renderChildTag($tags, tag, path, child.name);  
	      };
	  }
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
	       	var fakeDataTags = new TagsData();
							
	        var childTag = fakeDataTags.getTag(path);        
	        self.container.name = path;
	        self.container.tag = childTag;	
	        self.container.items = [];	        		       	
	       	var numberOfItems = Math.floor(Math.random() * 50);         
     		for (var i = 0; i < numberOfItems; i++) {
        		self.container.items.push(fakeDataContainer.getRandomItem());
     		};
     		self.clean();
     		self.renderView();
	      }
	    );
    }
  });
  return TagContainer;
});