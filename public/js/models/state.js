define([
  'underscore',
  'backbone',
  'collections/dashboards'
], function(_, Backbone, Dashboards, Tag, TagsData) {
  var State = Backbone.Model.extend({
    loadInitialData: function(){
      this.loadDashboards();
    },
    loadDashboards: function(){
      this.dashboards = new Dashboards(initialOptions.dashboards, {currentDashboardId: initialOptions.currentDashboardId})
           
      /*
      for(index in initialOptions.dashboards){

        var dashboard = new Dashboard(initialOptions.dashboards[index]);
        this.dashboards[dashboard.get('label')] = dashboard;
        if(initialOptions.currentDashboardId == dashboard.get('id'))
          this.currentDashboard = dashboard;
      }*/
    }
  });
  var _state = new State();
  return _state;
});

