// Filename: router.js

var _state = require('models/state'),        
    Backbone = require('backbone'),
    HomeView = require('components/built/home');
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
        var self = this;
        _state.isExtensionInstalled(function(installed) {
            self.homeView = HomeView.render(
                self.getDocHeight(),
                self.getDocWidth(),
                _state.getAllListboards(),
                _state.getSelectedListboard(),
                installed
            ); 
        })
    },
    initialize: function () {
        //Load initial data
        var self = this;
        _state.init({
            callback: function(key) {
                self.stateChanged(key)
            }
        })
        _state.loadInitialData();

        //Saves reference to the socket
        var url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
        this.socket = io.connect(url);

        this.loadWindowEvent();        
        this.loadServerEvents();
    },
    loadWindowEvent: function() {
        //TODO: view is there is a better way to capture and pass events
        var self = this;
        $(window).resize(function () {
            self.homeView.setState({ 
                docHeight: self.getDocHeight(), 
                docWidth: self.getDocWidth()
            });
        });  
    },
    getDocHeight: function() {
        return $(window).height(); 
    },
    getDocWidth: function() {
        return $(window).width(); 
    },
    stateChanged: function(key) {
        if(this.homeView) {
            if(_.contains([
                'listboard.added',
                'listboard.removed'
            ], key))
                this.homeView.setState({ listboards: _state.getAllListboards(), selectedListboard: _state.getSelectedListboard() });
            else if(_.contains([
                'selected.listboard.changed',
                'selected.listboard.container.added',
                'selected.listboard.container.changed',
                'selected.listboard.container.removed',
                'selected.listboard.folder.added',
                'selected.listboard.folder.changed',
                'selected.listboard.folder.removed'
            ], key)){                     
                this.homeView.setState({ selectedListboard: _state.getSelectedListboard() }); 
            }
            else if(_.contains([
                'extension.possible.installed'
            ], key)){            
                this.homeView.setState({ isExtensionInstalled: true}); 
            }            
        }
    },
    loadServerEvents: function() {        
        require('events/listboard')(this.socket);
        require('events/folder')(this.socket);
        require('events/container')(this.socket);
        require('events/item')(this.socket);
    }
});

module.exports.initialize = function () {
    var app_router = new AppRouter();
    //Start monitoring all hashchange events for history
    Backbone.history.start({pushState: true});
    return app_router;
};
