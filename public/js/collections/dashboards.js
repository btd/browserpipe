define([
  'underscore',
  'backbone',
  'models/dashboard'
], function(_, Backbone, Dashboard){
  var DashboardCollection = Backbone.Collection.extend({
    model: Dashboard,    
    url: "/dashboards",
    initialize: function(){
    },
    getCurrentDashboard: function(){
      return this.currentDashboard;
    },
    setCurrentDashboard: function(id){  
      //Not working this.get yet, not sure why
      //this.currentDashboard = this.get(id)
      //console.log(this.get)
    }
  });
  return DashboardCollection;
});