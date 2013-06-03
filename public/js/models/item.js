define([
  'underscore',
  'backbone',  
  'models/model'
], function(_, Backbone, AppModel) {
  var Item = AppModel.extend({
    urlRoot: "/items",
    defaults: {  
    },
    initialize: function(spec){     
    },
    getTags: function(){
      var _state = require('models/state');
      return _.map(this.get('tags'), function(filter){
        return _state.getTagByFilter(filter);
      })
    }
  });
  return Item;
});
