define([
  'underscore',
  'backbone',  
  'models/model'
], function(_, Backbone, AppModel) {
  var Container = AppModel.extend({
    urlRoot: "/containers",
    defaults: {  
    },
    initialize: function(spec){
      //If it is not a search container we load the tag      
      var self = this;
      var _state = require('models/state');
      this.tag = _state.getTagByFilter(this.get('filter'));
      //If the tag changes its filter, container has to be updated
      this.tag.on('change:path', function(filter, oldFilter){          
        self.save({filter: self.tag.getFilter()});
      }); 
      this.tag.on('change:label', function(filter, oldFilter){          
        self.save({title: self.tag.get('label'), filter: self.tag.getFilter()});
      }); 
    },
    parse : function(resp, xhr) {
      //TODO: need to add the JSON parse to transform response string in obj. If not it does not work.
      return JSON.parse(resp);
    }
  });
  return Container;
});
