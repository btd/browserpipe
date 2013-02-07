define([
  'underscore',
  'backbone',
  'collections/tags',
  'exports' //This is for circular dependency between Tag and TagCollection
], function(_, Backbone, TagCollection) {
  var Tag = Backbone.Model.extend({
    urlRoot: "/tags",
    defaults: {
      isRoot: false      
    },
    initialize: function(spec){      
      this.set('children', new TagCollection());
    },
    fetch : function(options) { 
      var self = this;
      var success = options.success;
      var error = options.error;
      options.success = function(resp, status, xhr) {
        var tag = resp[0];        
        if(tag){
          if (!self.set(tag, options)) return false;
          if (success) success(self, resp, options);
        }
        else{
          if (error) error("invalid path");
          else return false;
        }
      };
      return Backbone.sync('read', this, options);
    },
    validate: function (attrs) {
        if (attrs.label) {
            if (!_.isString(attrs.label) || attrs.label === 0 ) {
                return "Tag label must be a string with a length";
            }
        }
    },
    addChildren: function(children){
      this.get('children').add(children);
    },
    getFullPath: function(){
      return (this.get('isRoot')?"":this.get('path') + ".") + this.get('label')
    }
  });
  return Tag;
});


/*

tag = new Tag();

tag.set({
title: "The Matrix",
format: "dvd'
});


tag.get('title');

tag = new Tag({
    title: "The Matrix",
    format: "dvd'
});
*/
