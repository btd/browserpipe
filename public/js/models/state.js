define([
  'underscore',
  'backbone',
  'collections/dashboards',
  'collections/containers',
  'models/tag'
], function(_, Backbone, Dashboards, Containers, Tag) {
  var State = Backbone.Model.extend({
    tags: {},
    loadInitialData: function(){
      //Loads Tags
      this.loadTags();

      //Prepares containers and dashboards
      this.assignContainersToDashBoards();

      //Loads Dashboards
      this.loadDashboards();
    },
    loadTags: function(){
      //Create root tags
      this.createRootTag("root_tags", "Tags");
      this.createRootTag("root_imports", "Imports");
      this.createRootTag("root_devices", "Devices");
      this.createRootTag("root_trash", "Trash");

      //Load children tags
      var initialTags = initialOptions.tags || [];
      for(index in initialTags){        
        var tagItem = initialTags[index];
        var tag = new Tag(tagItem);        
        this.tags[tag.getFilter()] = tag;
        var parentTag = this.tags[tag.get('path')];
        parentTag.addChildren(tag);       
        this.tagFilterChangedEvent(tag);        
        this.tagDeletedEvent(tag);                
      }
    },
    createRootTag: function(id, label){
      var tag = new Tag({_id: id, label: label, path: ""});
      this.tags[label] = tag;    
    },
    addTag: function(tag){
      this.tags[tag.getFilter()] = tag;
    },
    tagFilterChangedEvent: function(tag){      
      //If filter change, it updates the key
      var self = this;
      tag.on('filterChanged', function(filter, oldFilter){
        delete self.tags[oldFilter]
        self.tags[filter] = tag;
      }); 
    },
    tagDeletedEvent: function(tag){
      //If the tag is deleted, it removes it from tags
      var self = this;
      tag.on('deleted', function(tag){        
        console.log('tagDeletedEvent')
        delete self.tags[tag.getFilter()]
      });
    },
    loadDashboards: function(){
      this.dashboards = new Dashboards(initialOptions.dashboards)      
    },
    assignContainersToDashBoards: function(){
      for(index in initialOptions.dashboards){
        var dashboard = initialOptions.dashboards[index];
        dashboard.containers = this.getContainersByDashboard(dashboard._id)
      }
    },
    getContainersByDashboard: function(dashboardId){      
      return _.filter(initialOptions.containers, function(container){ return container.dashboard === dashboardId; });
    },
    //TODO: Now all tags are loaded in memory.
    //      It should loads tags from server in an optmized way
    //      And this method shoud return a promise
    getTagByFilter: function(filter){
      return this.tags[filter];
    }
  });
  var _state = new State();
  return _state;
});

