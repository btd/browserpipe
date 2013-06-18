var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var AppView = require('views/view');
var EditDashboard = require('views/dialogs/edit.dashboard');
var DashboardContainer = require('views/center/dashboard');
var Dashboard = AppView.extend({
    el: "#opt-dashboards",
    dashboardTemplate: _.template('<li class="opt-add" id="opt-dash-<%= dashboard.get("_id") %>"><a tabindex="-1" href="#"><%= dashboard.get("label") %></a></li>'),
    events: {
        "click #opt-add-dash": "addDashboardOption",
        "click #opt-edit-dash": "editDashboardOption",
        "click .opt-add": "changeDashboardOption"
    },
    initializeView: function () {
        this.listenTo(this.collection, 'change', this.dashboardUpdated);
        this.listenTo(this.collection, 'add', this.addDashboard);
        this.listenTo(this.collection, 'remove', this.removeDashboard);
        this.listenTo(this.collection, 'currentDashboardChange', this.renderCurrentDashboard);
    },
    renderView: function () {
        var self = this;
        this.collection.map(function (dashboard) {
            self.addDashboard(dashboard);
        })
        this.checkCollectionSize();
        return this;
    },
    postRender: function () {
    },
    renderCurrentDashboard: function (currentDashboard) {
        if (currentDashboard) {
            if (this.dashboardContainerView)
                this.dashboardContainerView.dispose();
            this.$('.name').html(currentDashboard.get('label'))
            this.dashboardContainerView = new DashboardContainer({model: currentDashboard})
            $("#main-container").html(this.dashboardContainerView.render().el);
        }
        else {
            this.$('.name').html('<i>No dashboard</i>');
        }
    },
    dashboardUpdated: function (dashboard) {
        this.$("#opt-dash-" + dashboard.get("_id") + " > a").html(dashboard.get('label'))
        var currentDashboard = this.collection.getCurrentDashboard();
        if (currentDashboard.get('_id') === dashboard.get('_id'))
            this.renderCurrentDashboard(currentDashboard);
    },
    addDashboard: function (dashboard) {
        var compiledTemplate = this.dashboardTemplate({dashboard: dashboard});
        this.$(".divider:last").before(compiledTemplate)
        this.checkCollectionSize();
    },
    removeDashboard: function (dashboard) {
        this.$("#opt-dash-" + dashboard.get("_id")).remove();
        this.checkCollectionSize();
    },
    checkCollectionSize: function () {
        if (this.collection.length == 0)
            this.$("#opt-edit-dash, .divider").hide();
        else
            this.$("#opt-edit-dash, .divider").show();
    },
    addDashboardOption: function () {
        var editDashboard = new EditDashboard({collection: this.collection});
        editDashboard.render();
        this.toggle();
    },
    editDashboardOption: function () {
        var editDashboard = new EditDashboard({collection: this.collection, dashboard: this.collection.getCurrentDashboard()});
        editDashboard.render();
        this.toggle();
    },
    changeDashboardOption: function (event) {
        var id = event.currentTarget.id.substring(9); //removes "opt-dash-" from the id
        var dashboard = this.collection.get(id);
        if (dashboard) {
            this.collection.setCurrentDashboard(dashboard.get('_id'));
            this.toggle();
        }
    },
    toggle: function () {
        this.$(".open").removeClass("open");
    }
});
module.exports = Dashboard;
