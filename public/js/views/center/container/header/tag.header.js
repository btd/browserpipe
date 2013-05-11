define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',
  'views/center/container/header/header',
  'views/center/container/tag/header.tag'
], function($, _, Backbone, _state, ContainerHeader, Tag){
  var TagContainerHeader = ContainerHeader.extend({
    initializeView: function(options){           
      ContainerHeader.prototype.initializeView.call(this);    

      //Replace title with tags
      /*this.addEvents({
        "click .container-icon" : "navigateToRoot"
      });*/
    },
    renderView: function(){
      var self = this;
      //Render header normally
      ContainerHeader.prototype.renderView.call(this);      
      //Replaces the title with the tags      
      /*var $tags = $('<ul class="tags"></ul>');
      $('.title', this.$el).html($tags);
      if(!this.model.get('isRoot')) {
        var names = this.model.get('path').split('.');       
        var path = '';        
        for (i = 0; i < names.length; i++) {
          path = (i==0?"":path + ".") + names[i];
          var tag = _state.getTagByFilter(path);
          var t = new Tag({tag: tag});
          $tags.append(t.render().el);
          t.on('tagClicked', self.navigateToTag, self);                
        }
      }
      //Adds the tag
      var t = new Tag({tag: this.model});
      $tags.append(t.render().el);
      t.on('tagClicked', this.navigateToTag, this);     */
      return this;
    }/*,
    navigateToRoot: function(e){
      console.log('navingating to root')
    },
    navigateToTag: function(tag){
      this.trigger("navigateToTag", tag);
    }*/
  });
  return TagContainerHeader;
});