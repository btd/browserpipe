define([
  'underscore',
  'backbone',
  'models/dashboard'
], function(_, Backbone, Dashboard){
  var DashboardCollection = Backbone.Collection.extend({
    model: Dashboard,    
    url: "/dashboards",
    initialize: function(models, options){
      this.currentDashboardId = options.currentDashboardId;
      this.on('add', this.dashboardAdded, this);
      this.on('remove', this.dashboardRemoved, this);
    },
    getCurrentDashboard: function(){
      return this.currentDashboardId && this.get(this.currentDashboardId);
    },
    setCurrentDashboard: function(dashboard){
      this.currentDashboardId = dashboard && dashboard.get("_id");
      this.trigger('currentDashboardChange', dashboard);  
    },
    dashboardAdded: function(dashboard){
      if(!this.currentDashboardId)
        this.setCurrentDashboard(dashboard)
    },
    dashboardRemoved: function(dashboard){
      if(this.currentDashboardId &&  this.currentDashboardId === dashboard.get('_id'))
        this.setCurrentDashboard(this.first())              
    }
  });
  return DashboardCollection;
});