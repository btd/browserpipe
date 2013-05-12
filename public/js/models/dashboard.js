define([
  'underscore',
  'backbone',
  'models/model',
  'collections/containers'
], function(_, Backbone, AppModel, Containers) {
  var Dashboard = AppModel.extend({
    urlRoot: "/dashboards",
    defaults: {  
    },
    initialize: function(){      
    },
    parse: function(resp, xhr){      
      return JSON.parse(resp);
    },
    addContainer: function(container, options){
      container.dashboard = this.get('_id')
      return this.containers.create(container, options);
    },
    removeContainer: function(container){
      this.containers.remove(container);
      container.destroy();
    }
  });
  return Dashboard;
});
