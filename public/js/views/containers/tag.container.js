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
    renderChildsTags: function(){      
      var tag = this.container.tag;      
	  	var $tags = $('<ul class="tags ' + (this.collapsed?' collapsed':'') + '"></ul>');
	  	$('.box', this.el).append($tags);
      //Render navigate to parent (...) except for root tag
      if(!tag.get('isRoot'))    	  	
	  	  this.renderChildTag($tags, tag, tag.get('path'), '...', true);
	  	//Render childs tags
      for (var i = 0, l = tag.get('children').length; i < l; i++) {       	
        var childTag = tag.get('children').models[i];   
  	  	var path = (tag.get('isRoot')?"":tag.get('path') + ".") + tag.get('label') + "." + childTag.get('label');	  	  	
      	this.renderChildTag($tags, tag, path, childTag.get('label'), false);  
      };
	    return this;
    },
    renderChildTag: function($tags, tag, path, title, isBackOption){
    	var self = this;    	
    	var cct = new ContainerChildTag({title: title, path: path, isBackOption: isBackOption});
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
    }
  });
  return TagContainer;
});