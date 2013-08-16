// Filename: router.js

var _state = require('models/state'),    
    Search = require('views/top-bar/search'),    
    Sections = require('views/top-bar/sections'),
    Home = require('views/center/home'),
    Welcome = require('views/center/welcome'),
    AccordionListboards = require('views/center/listboard/accordion.listboards'),
    Backbone = require('backbone');

var AppRouter = Backbone.Router.extend({
    views: {},
    routes: {        
        '/' : 'home',
        'welcome' : 'welcome',
        'listboards': 'listboards',
        'listboards#now': 'listboards',
        'listboards#later': 'listboards',
        'listboards#future': 'listboards',
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
    listboards: function (actions) {     
        var accordionListboards = new AccordionListboards();       
        accordionListboards.render();
    },   
    initialize: function () {
        //Load initial data
        _state.loadInitialData();

        this.sections = new Sections();
        this.sections.render();
    }
});

module.exports.initialize = function () {
    var app_router = new AppRouter;
    //Start monitoring all hashchange events for history
    Backbone.history.start({pushState: true});
    return app_router;
};
