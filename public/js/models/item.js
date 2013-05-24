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
    }
  });
  return Item;
});
