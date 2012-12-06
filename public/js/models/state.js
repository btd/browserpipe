define([
  'underscore',
  'backbone',
  'models/tag',
  'data/tags'
], function(_, Backbone, Tag, TagsData) {
  var State = Backbone.Model.extend({
    tags: {},
    defaults: {},
    loadInitalTags: function(){        
      //Tag root is added here
      var tag = new Tag({        
        label: 'root',
        path: '',
        isRoot: true,
        icon: '/img/tag.png'
      });        
      this.tags["root"] = tag;
      //Load inline tags
      for(index in initialTags){
        var tagItem = initialTags[index];
        var tag = new Tag(tagItem);        
        this.tags[tagItem.path + "." + tag.get('label')] = tag;
        if(!tag.get('isRoot')){          
          //Gets the parent that is loaded and add itself as a child  
          var parentTag = this.tags[tagItem.path];
          parentTag.addChildren(tag);
        }
      }
    },
    getTag: function(path, options){
      var options = options || {};
      var self = this;
      var tag = this.tags[path];      
      var success = options.success;
      var error = options.error;
      if(!tag){
        var tag = new Tag({id: path});
        if(tag.fetch({ 
          success: function(tag, resp, options) {            
            self.tags[path] = tag;
            if(success) success(tag)
          },
          error: function(error) {
            tag = null;
            if(error) error(error)
          }
        }));        
      }
      else if(success) success(tag)
    }
    ,
    createFakeData: function(){
      //TODO: remove!!!
      var fakeTagData = new TagsData();
      var rootTag = fakeTagData.getRoot();      
      this.createFakeChildData("", rootTag, fakeTagData)
    },
    createFakeChildData: function(parentPath, parentTag, fakeTagData){
      //TODO: remove!!!
      if(parentTag.children)
        for(index in parentTag.children){    
          var fullpath = (parentPath!=""?parentPath + ".":"")  + parentTag.children[index].name
          console.log(fullpath);
          var tag = fakeTagData.getTag(fullpath);
          var tag1 = new Tag({label: tag.name, path: "root" + (parentPath!=""?"." + parentPath:"")});          
          tag1.save(); 
          this.createFakeChildData(fullpath, tag, fakeTagData);
        }      
    }
  });
  var _state = new State();
  return _state;
});

