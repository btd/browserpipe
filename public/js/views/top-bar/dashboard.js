define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',
  'views/view'
], function($, _, Backbone, _state, AppView){
  var Dashboard = AppView.extend({
    name: 'Dashboard',
    el: $("#opt-dashboards"),     
    events: {
    }, 
    initializeView: function(){ 
      _state.on('currentDashboardChanged', this.renderCurrentDashboard)
    },     
    renderView: function(){      
      return this;    
    },
    postRender: function(){
      var _this = this;   
    },
    renderCurrentDashboard: function(){      
      if(_state.currentDashboard){
        $('.name', this.el).html(_state.currentDashboard.get('label'))
      }
    }
  });
  return Dashboard;
});