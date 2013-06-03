define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',  
  'models/tag',
  'views/view',    
  'views/tags.editor/tag',
  'text!templates/tags/tags.editor.text'  
], function($, _, Backbone, _state, Tag, AppView, TagsEditorTag, template){
  var TagsEditor = AppView.extend({    
    attributes : function (){
      return {
        class : 'tags-editor'
      }
    },  
    events: {
      "keyup": "keypressed"
    }, 
    initializeView: function(){ 
      var self = this;
      this.listenTo(this.collection, 'add', function(tag){
        self.renderTag(tag)
        self.trigger("tagAdded", tag);
      });
    },     
    renderView: function(){ 
      var self = this;
      var compiledTemplate = _.template(template, {});    
      this.$el.html(compiledTemplate);
      this.collection.each(function(tag){
        if(tag.isUserTag())
          self.renderTag(tag)
      })
      //Prepare autocomplete
      this.prepareTypeAhead();
      return this;    
    },
    renderTag: function(tag){
      var self = this;
      var tagsEditorTagView = new TagsEditorTag({model: tag});
      this.$('.editor-tags').prepend(tagsEditorTagView.render().el);
      this.listenTo(tagsEditorTagView, 'tagRemoved', function(tag){        
        self.collection.remove(tag);
        self.stopListening(tagsEditorTagView);  
        self.trigger("tagRemoved", tag);      
      });
    },
    prepareTypeAhead: function(){       
      var self = this;   
      this.$('.editor-tag-input').typeahead({
        autoselect: false,
        source: this.getUserTagsList(),
        //TODO: implement something like sublime text 2 for autocomplete
        /*,
        matcher: function (item) {    

        },
        sorter: function (items) {          

        },
        highlighter: function (item) {          

        },*/
        updater: function (item) {    
          if(item)
            self.addTag(item)
          else
            self.addTag(self.$('.editor-tag-input').val())
        }
      });    
    },    
    getUserTagsList: function(){
      //TODO: review this if we load tags from server async in the future
      var self = this;
      return _.chain(_state.tags)
      .values()
      .filter(function(tag){ 
        return !self.collection.contains(tag) && tag.isUserTag();
      })
      .map(function(tag){ 
        var filter = tag.getFilter();
        return filter.substring(5, filter.length); 
      })
      .value();
    },
    postRender: function(){
    },
    keypressed: function(event){
      if(event.keyCode === 13){        
        event.stopPropagation();
        var $target = $(event.target);
        //If enter inside form, we submit it
        if($target.hasClass("editor-tag-input")){
          var $input = $target;
          this.addTag($input.val());
          $input.val('');
        }
      }        
    },
    addTag: function(label){      
      var filter = 'Tags/' + $.trim(label);
      //Check if already exists
      if(this.collection.filter(function(tag){ return tag.getFilter() === filter; }).length > 0)        
        return;
      var tag = _state.getTagByFilter(filter);
      if(!tag)
        tag = this.createTag(filter);
      this.collection.add(tag);
    },
    createTag: function(filter){
      var index = filter.lastIndexOf('/'); //It has at least one /
      var path = filter.substring(0, index);
      var label = filter.substring(index + 1);
      return new Tag({
        label: label,
        path: path
      });
    }
  });
  return TagsEditor;
});