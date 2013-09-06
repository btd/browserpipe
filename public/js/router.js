// Filename: router.js

var _state = require('models/state'),    
    Search = require('views/top-bar/search'),    
    Sections = require('views/top-bar/sections'),
    AccountNav  = require('views/top-bar/account.nav'),
    Settings = require('views/center/settings'),
    Help = require('views/center/help'),
    Welcome = require('views/center/welcome'),
    AccordionListboards = require('views/center/listboard/accordion.listboards'),
    Backbone = require('backbone'),
    io = require('socket.io');

var AppRouter = Backbone.Router.extend({
    views: {},
    routes: {        
        '/' : 'gotoListboards',
        'welcome' : 'welcome',        
        'listboards': 'listboards',
        'settings': 'settings',
        'help': 'help',
        // Default
        '*actions': 'gotoListboards'
    },
    gotoListboards: function (actions) {   
        Backbone.history.navigate('/listboards', {trigger: true});
    },
    welcome: function (actions) {     
        if(!this.welcomeView) {
            this.welcomeView = new Welcome();       
            this.welcomeView.render();
        }
        this.cleaMainContainer('welcome');
        this.welcomeView.show();
    },
    listboards: function (actions) {               
        if(!this.accordionListboardsView) {
            this.accordionListboardsView = new AccordionListboards();       
            this.accordionListboardsView.render();
        }
        this.cleaMainContainer('accordionListboards');
        this.accordionListboardsView.show();        
    },   
    settings: function (actions) {     
        if(!this.settingsView) {
            this.settingsView = new Settings();       
            this.settingsView.render();
        }
        this.cleaMainContainer('settings');
        this.settingsView.show();
    },
    help: function (actions) {     
        if(!this.helpView) {
            this.helpView = new Help();       
            this.helpView.render();
        }
        this.cleaMainContainer('help');
        this.helpView.show();
    },
    cleaMainContainer: function(exception){
        if(exception != 'welcome' && this.welcomeView)
            this.welcomeView.hide();        
        if(exception != 'accordionListboards' && this.accordionListboardsView)
            this.accordionListboardsView.hide();
        if(exception != 'settings' && this.settingsView)
            this.settingsView.hide();
        if(exception != 'help' && this.helpView)
            this.helpView.hide();        
    },
    initialize: function () {
        //Load initial data
        _state.loadInitialData();

        //Top bar accordtion sections
        this.sections = new Sections();
        this.sections.render();

        //Top bar account nav
        this.accountNav = new AccountNav();
        this.accountNav.render();

        //Saves reference to the socket
        var url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
        this.socket = io.connect(url);

        //Load model events
        require('events/listboard')(this.socket);
        require('events/container')(this.socket);
        require('events/item')(this.socket);

    }
});

module.exports.initialize = function () {
    var app_router = new AppRouter;
    //Start monitoring all hashchange events for history
    Backbone.history.start({pushState: true});
    return app_router;
};
