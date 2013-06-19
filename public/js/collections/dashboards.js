var Dashboard = require('models/dashboard'),
    Backbone = require('backbone');

module.exports = DashboardCollection = Backbone.Collection.extend({
    model: Dashboard,
    url: "/dashboards",
    initialize: function (models) {
        this.listenTo(this, 'remove', this.dashboardRemoved);
    },
    getCurrentDashboard: function () {
        return this.currentDashboardId && this.get(this.currentDashboardId);
    },
    getCurrentContainer: function () {
        var currentDashboard = this.getCurrentDashboard()
        return currentDashboard && currentDashboard.containers.get(this.currentContainerId);
    },
    setCurrentDashboard: function (dashboardId) {
        this.currentDashboardId = dashboardId;
        var dashboard = this.get(dashboardId);
        //Triggers event
        this.trigger('currentDashboardChange', dashboard);
        //Sets the first container as current one
        if (dashboard && dashboard.containers.length > 0)
            this.setCurrentContainer(dashboard.containers.at(0));
        else
            this.setCurrentContainer(null);
    },
    setCurrentContainer: function (containerId) {
        this.currentContainerId = containerId;
        var currentDashboard = this.getCurrentDashboard();
        var container = null;
        if (currentDashboard)
            container = currentDashboard.containers.get(containerId)
        this.trigger('currentContainerChange', container);
    },
    dashboardRemoved: function(){
        //If current dashboard removed, then we load another
        if(!this.getCurrentDashboard()){
            if(this.length > 0)
                this.setCurrentDashboard(this.at(0).get('_id'));
            else
                this.setCurrentDashboard(null);
        }
    }
});