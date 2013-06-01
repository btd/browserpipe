define([
  'underscore',
  'backbone',
  'collections/dashboards',
  'collections/containers',
  'collections/items',
  'models/tag'
], function(_, Backbone, Dashboards, Containers, ItemCollection, Tag) {
  var State = Backbone.Model.extend({
    tags: {},
    loadInitialData: function(){

      //Loads Tags
      this.loadTags();

      //Loads Dashboards
      this.loadDashboards();

      //Load items
      this.loadItems();
    },
    loadTags: function(){
      //Load children tags
      var initialTags = initialOptions.tags || [];
      _.each(initialTags, function(tagItem) {
        var tag = new Tag(tagItem);        
        this.tags[tag.getFilter()] = tag;
        if(!_.isEmpty(tag.get('path'))) {
          var parentTag = this.tags[tag.get('path')];
          parentTag.addChildren(tag);
        }  
        this.tagFilterChangedEvent(tag);        
        this.tagDeletedEvent(tag);       
      }, this);
    },
    addTag: function(tag){
      this.tags[tag.getFilter()] = tag;
    },
    tagFilterChangedEvent: function(tag){      
      //If filter change, it updates the key
      var self = this;
      this.listenTo(tag, 'filterChanged', function(filter, oldFilter){
        delete self.tags[oldFilter]
        self.tags[filter] = tag;
      }); 
    },
    tagDeletedEvent: function(tag){
      //If the tag is deleted, it removes it from tags
      var self = this;
      this.listenTo(tag, 'deleted', function(tag){        
        console.log('tagDeletedEvent')
        delete self.tags[tag.getFilter()]
      });
    },
    loadDashboards: function(){
      this.dashboards = new Dashboards(initialOptions.dashboards)      
    },
    loadItems: function(){
      var self = this;
      for(index in initialOptions.items){
        var item = initialOptions.items[index];
        _.map(item.tags, function(filter){           
          var tag = self.getTagByFilter(filter);
          if(tag){
            if(!tag.items)
              tag.items = new ItemCollection();
            tag.addItem(item);
          }
        });
      }
    },
    //TODO: Now all tags are loaded in memory.
    //      It should loads tags from server in an optmized way
    //      And this method shoud return a promise
    getTagByFilter: function(filter){
      return this.tags[filter];
    },
    getItemsByFilter: function(filter){
      //TODO: load items
      return [];
    },
    addItemToTags: function(item){      
      var self = this;
      _.map(item.get('tags'), function(filter){
        var tag = self.getTagByFilter(filter);
        if(tag)
          tag.addItem(item);
      });
    }
  });
  var _state = new State();
  return _state;
});

