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
    initialize: function(spec){      
      //Creates a collection of containers
      this.set('containers', new Containers(this.get('containers')));
    },
    parse: function(resp, xhr){      
      return JSON.parse(resp);
    },
    addContainer: function(container, options){
      container.dashboard = this.get('_id')
      return this.get('containers').create(container, options);
    },
    removeContainer: function(container){
      this.get('containers').remove(container);
      container.destroy();
    }
  });
  return Dashboard;
});
