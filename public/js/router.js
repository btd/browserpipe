// Filename: router.js

var _state = require('models/state'),    
    Search = require('views/top-bar/search'),
    Center = require('views/center/center'),
    Home = require('views/center/home'),
    Welcome = require('views/center/welcome'),
    Now = require('views/center/now'),
    Later = require('views/center/later'),    
    Future = require('views/center/future'),    
    Backbone = require('backbone');

var AppRouter = Backbone.Router.extend({
    views: {},
    routes: {        
        '/' : 'home',
        'welcome' : 'welcome',
        'now': 'showEmptyNow',
        'now/:id': 'showNow',
        'later': 'showEmptyLater',
        'later/:id': 'showLater',
        'later': 'showFuture',
        // Default
        '*actions': 'home'
    },
    home: function (actions) {   
        var home = new Home();       
        home.render();
    },
    welcome: function (actions) {     
        var welcome = new Welcome();       
        welcome.render();
    },
    showEmptyNow: function (id) {   
        if (_state.browsers.length > 0)
            Backbone.history.navigate("/now/" + _state.browsers.at(0).get('_id'), {trigger: true});
        else {
            var now = new Now();       
            now.render();
        }
    },
    showNow: function (id) {
        if (_state.browsers.length === 0)
            Backbone.history.navigate("/now", {trigger: true});
         else {
            var now = new Now();       
            now.render();
        }
    },
    showEmptyLater: function (id) {        
        if (_state.listboards.length > 0)
            Backbone.history.navigate("/later/" + _state.listboards.at(0).get('_id'), {trigger: true});
        else {
            var later = new Later();       
            later.render();
        }
    },
    showLater: function (id) {
        if (_state.listboards.length === 0)
            Backbone.history.navigate("/later", {trigger: true});
        else {
            var later = new Later();       
            later.render();
        }
    },
    showFuture: function() {
        var future = new Future();       
        future.render();
    },    
    initialize: function () {
        //Load initial data
        _state.loadInitialData();

        //Renders the center
        this.views.center = new Center();       
        this.views.center.render();
    }
});

module.exports.initialize = function () {
    var app_router = new AppRouter;
    //Start monitoring all hashchange events for history
    Backbone.history.start({pushState: true});
    return app_router;
};
