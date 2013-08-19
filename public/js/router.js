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
        'listboards#now': 'listboardSection',
        'listboards#later': 'listboardSection',
        'listboards#future': 'listboardSection',
        'listboards': 'listboardSection',
        // Default
        '*actions': 'home'
    },
    home: function (actions) {   
        if(!this.homeView) {
            this.homeView = new Home();       
            this.homeView.render();
        }
        this.cleaMainContainer('home');
        this.homeView.show();
    },
    welcome: function (actions) {     
        if(!this.welcomeView) {
            this.welcomeView = new Welcome();       
            this.welcomeView.render();
        }
        this.cleaMainContainer('welcome');
        this.welcomeView.show();
    },
    listboardSection: function (actions) {             
        if(location.hash === '')
            Backbone.history.navigate('/listboards#now', {trigger: true});
        else {
            if(!this.accordionListboardsView) {
                this.accordionListboardsView = new AccordionListboards();       
                this.accordionListboardsView.render();
            }
            this.cleaMainContainer('accordionListboards');
            section = location.hash.substr(1);        
            this.accordionListboardsView.show();
            this.accordionListboardsView.selectSection(section);
            this.sections.selectSelector(section);
        }
    },   
    cleaMainContainer: function(exception){
        if(exception != 'home' && this.homeView)
            this.homeView.hide();
        if(exception != 'welcome' && this.welcomeView)
            this.welcomeView.hide();        
        if(exception != 'accordionListboards' && this.accordionListboardsView)
            this.accordionListboardsView.hide();
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
