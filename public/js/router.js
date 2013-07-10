// Filename: router.js

var _state = require('models/state'),
    TopBarListboard = require('views/top-bar/listboard'),
    Search = require('views/top-bar/search'),
    Device = require('views/top-bar/device'),
    Import = require('views/top-bar/import'),
    BreadCrumb = require('views/bottom-bar/breadcrumb'),
    Trash = require('views/bottom-bar/trash'),
    Backbone = require('backbone');


var AppRouter = Backbone.Router.extend({
    views: {},
    routes: {
        'listboards': 'showEmptyListboard',
        'listboards/:id': 'showListboard',
        // Default
        '*actions': 'defaultAction'
    },
    showEmptyListboard: function (id) {
        var currentListboard = _state.listboards.getCurrentListboard();
        if (currentListboard && _state.listboards.length > 0)
            Backbone.history.navigate("/listboards/" + currentListboard.get('_id'), {trigger: true});
    },
    showListboard: function (id) {
        if (_state.listboards.length === 0)
            Backbone.history.navigate("/listboards", {trigger: true});
    },
    defaultAction: function (actions) {
    },
    initialize: function () {
        //Load initial data
        _state.loadInitialData();

        _state.listboards.on('currentListboardChange', function (listboard) {
            if(listboard)
                Backbone.history.navigate('/listboards/' + listboard.get('_id'), {trigger: true});
            else
                Backbone.history.navigate('/listboards', {trigger: true});
        }, this);

        //Creates the top bar options
        this.views.topBarListboard = new TopBarListboard({collection: _state.listboards});
        this.views.topBarListboard.render();
        this.views.search = new Search();
        this.views.search.render();
        this.views.device = new Device();
        this.views.device.render();
        this.views.imports = new Import();
        this.views.imports.render();

        //Creates the bottom bar options
        this.views.breadCrumb = new BreadCrumb();
        this.views.breadCrumb.render();
        this.views.trash = new Trash();
        this.views.trash.render();

        //Sets the current listboard
        _state.listboards.setCurrentListboard(initialOptions.currentListboardId);
    }
});

module.exports.initialize = function () {
    var app_router = new AppRouter;
    //Start monitoring all hashchange events for history
    Backbone.history.start({pushState: true});
    return app_router;
};
