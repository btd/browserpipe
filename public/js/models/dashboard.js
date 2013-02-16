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
    }
  });
  return Dashboard;
});
