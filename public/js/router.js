// Filename: router.js

var _state = require('models/state'),        
    Backbone = require('backbone'),
    HomeComponent = require('components/built/home');
    io = require('socket.io');

var AppRouter = Backbone.Router.extend({
    views: {},
    routes: {        
        '/' : 'gotoListboards',   
        'listboards': 'listboards',
        'settings': 'settings',
        'help': 'help',
        // Default
        '*actions': 'gotoListboards'
    },
    gotoListboards: function (actions) {   
        Backbone.history.navigate('/listboards', {trigger: true});
    },
    listboards: function (actions) {               
        HomeComponent.render(this.getDocHeight(), this.getDocWidth());
    },
    /*listboards: function (actions) {               
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
    },*/
    initialize: function () {
        //Load initial data
        _state.loadInitialData();

        //Top bar accordtion sections
        /*this.sections = new Sections();
        this.sections.render();

        //Top bar account nav
        this.accountNav = new AccountNav();
        this.accountNav.render();*/

        //Saves reference to the socket
        var url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
        this.socket = io.connect(url);

        var self = this;
        $(window).resize(function () {
            HomeComponent.setDocumentSize(self.getDocHeight(), self.getDocWidth());
        });

        //Load model events
        require('events/listboard')(this.socket);
        require('events/folder')(this.socket);
        require('events/container')(this.socket);
        require('events/item')(this.socket);

    },
    getDocHeight: function() {
        return $(window).height(); 
    },
    getDocWidth: function() {
        return $(window).width(); 
    },
});

module.exports.initialize = function () {
    var app_router = new AppRouter();
    //Start monitoring all hashchange events for history
    Backbone.history.start({pushState: true});
    return app_router;
};
