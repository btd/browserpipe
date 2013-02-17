define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'views/dialogs/edit-dashboard'
], function($, _, Backbone, AppView, EditDashboard){
  var Dashboard = AppView.extend({
    name: 'Dashboard',
    el: "#opt-dashboards",     
    dashboardTemplate: _.template('<li class="opt-add" id="opt-dash-<%= dashboard.get("_id") %>"><a tabindex="-1" href="#"><%= dashboard.get("label") %></a></li>'),  
    events: {
      "click #opt-add-dash" : "addDashboardOption",
      "click #opt-edit-dash" : "editDashboardOption",
      "click .opt-add" : "changeDashboardOption"
    }, 
    initializeView: function(){ 
      this.collection.on("change", this.dashboardUpdated, this);
      this.collection.on('add', this.addDashboard, this);
      this.collection.on('remove', this.removeDashboard, this);
      this.collection.on('currentDashboardChange', this.renderCurrentDashboard, this);
    },     
    renderView: function(){   
      var self = this;
      this.renderCurrentDashboard(this.collection.getCurrentDashboard());
      this.collection.map(function(dashboard){        
        self.addDashboard(dashboard);
      })
      this.checkCollectionSize();
      return this;    
    },
    postRender: function(){
      var _this = this;   
    },    
    renderCurrentDashboard: function(currentDashboard){      
      if(currentDashboard)
        this.$('.name').html(currentDashboard.get('label'))
      else
        this.$('.name').html('<i>No dashboard</i>');
    },
    dashboardUpdated: function(dashboard){
      this.$("#opt-dash-" + dashboard.get("_id") + " > a").html(dashboard.get('label'))
      var currentDashboard = this.collection.getCurrentDashboard();
      if(currentDashboard.get('_id') === dashboard.get('_id'))
        this.renderCurrentDashboard(currentDashboard);
    },
    addDashboard: function(dashboard){            
      var compiledTemplate = this.dashboardTemplate({dashboard: dashboard});    
      this.$(".divider:last").before(compiledTemplate)
      this.checkCollectionSize();
    },
    removeDashboard: function(dashboard){
      this.$("#opt-dash-" + dashboard.get("_id")).remove();
      this.checkCollectionSize();
    },
    checkCollectionSize: function(){
      if(this.collection.length == 0)
        this.$("#opt-edit-dash, .divider").hide();
      else
        this.$("#opt-edit-dash, .divider").show();
    },
    addDashboardOption: function(){
      var editDashboard = new EditDashboard({collection: this.collection});
      editDashboard.render();      
    },
    editDashboardOption: function(){  
      var editDashboard = new EditDashboard({collection: this.collection, dashboard: this.collection.getCurrentDashboard()});
      editDashboard.render();                   
    },
    changeDashboardOption: function(event){
      var id = event.currentTarget.id.substring(9); //removes "opt-dash-" from the id
      var dashboard = this.collection.get(id);
      if(dashboard)
        this.collection.setCurrentDashboard(dashboard);
    }
  });
  return Dashboard;
});