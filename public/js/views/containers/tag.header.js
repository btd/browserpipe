define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',
  'views/containers/header',
  'views/tags/tag'
], function($, _, Backbone, _state, ContainerHeader, Tag){
  var TagContainerHeader = ContainerHeader.extend({
    name: 'TagContainerHeader',
    initializeView: function(){           
      ContainerHeader.prototype.initializeView.call(this);    
      //Replace title with tags
      this.addEvents({
        "click .container-icon" : "navigateToRoot"
      });
    },
    renderView: function(){
      var self = this;
      //Render header normally
      ContainerHeader.prototype.renderView.call(this);      
      //Replaces the title with the tags      
      var $tags = $('<ul class="tags"></ul>');
      $('.title', this.$el).html($tags);
      if(!this.container.tag.get('isRoot')) {
        var names = this.container.tag.get('path').split('.');       
        var path = '';
        for (i = 0; i < names.length; i++) {
          path = (i==0?"":path + ".") + names[i];
          _state.getTag(path, {
              success: function(tag){  
                var t = new Tag({tag: tag});
                $tags.append(t.render().el);
                t.on('tagClicked', self.navigateToTag, self);                
              }, 
              error: function(err){        
                //TODO: manage the error
                console.log(err)
              }
           });
        }
      }
      //Adds the tag
      var tag = this.container.tag;
      var t = new Tag({tag: tag});
      $tags.append(t.render().el);
      t.on('tagClicked', this.navigateToTag, this);     
      return this;
    },
    navigateToRoot: function(e){
      console.log('navingating to root')
    },
    navigateToTag: function(tag){
      this.trigger("navigateToTag", tag);
    }
  });
  return TagContainerHeader;
});