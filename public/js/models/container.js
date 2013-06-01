define([
  'underscore',
  'backbone',  
  'models/model'
], function(_, Backbone, AppModel) {
  var Container = AppModel.extend({
    defaults: {  
    },
    initialize: function(spec){
      //If it is not a search container we load the tag      
      var self = this;
      var _state = require('models/state');
      this.tag = _state.getTagByFilter(this.get('filter'));
      //If the tag changes its filter, container has to be updated
      this.listenTo(this.tag, 'change:path', function(filter, oldFilter){          
        self.save({filter: self.tag.getFilter()});
      }); 
      this.listenTo(this.tag, 'change:label', function(filter, oldFilter){          
        self.save({title: self.tag.get('label'), filter: self.tag.getFilter()});
      }); 
    }
  });
  return Container;
});
