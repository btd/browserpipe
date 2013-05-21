define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',
  'views/view'
], function($, _, Backbone, _state, AppView){
  var Trash = AppView.extend({
    el: $("#trash-option"),
    events: {
      "click" : "openTrahContainer"
    },
    initializeView: function(){ 
      this.tag = _state.getTagByFilter("Trash");
    },
    openTrahContainer: function(e){
      e.preventDefault();
      _state.dashboards.getCurrentDashboard().addContainer({
        "filter": this.tag.getFilter(),
        "order": 0, //TODO: manage order
        "title": this.tag.get('label'),
        "type": 5
      },{wait: true, success: function(container) { 
        _state.dashboards.setCurrentContainer(container.get('_id'));
      }});  
    }
  });
  return Trash;
});