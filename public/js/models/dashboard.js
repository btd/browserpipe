define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var Dashboard = Backbone.Model.extend({
    urlRoot: "/dashboards",
    defaults: {   
    },
    initialize: function(spec){    
    }
  });
  return Dashboard;
});
