define([
  'underscore',
  'backbone',
  'models/model'
], function(_, Backbone, AppModel) {
  var Dashboard = AppModel.extend({
    urlRoot: "/dashboards",
    defaults: {  
    },
    initialize: function(spec){  
    },
    parse : function(resp, xhr) {
      //TODO: I need to add the JSON parse to transform response string in obj. If not it does not work.
      return JSON.parse(resp);
    }
  });
  return Dashboard;
});
