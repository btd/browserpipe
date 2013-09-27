// Filename: router.js

var _state = require('./state'),
    page = require('page'),
    HomeView = require('./components/home');
    io = require('socket.io'),
    $ = require('jquery');

var homeView, //react home component instance
    socket; //socket.io client socket

page('/', function () {
    setTimeout(function() {
        page('/listboards');
    }, 0);
});

page('/listboards', function () {
    var that = this;
    _state.isExtensionInstalled(function(installed) {
        homeView = HomeView.render(
            getDocHeight(),
            getDocWidth(),
            _state.getAllListboards(),
            _state.getSelectedListboard(),
            installed
        );
    })
});



var getDocHeight = function() {
    return $(window).height();
};

var getDocWidth = function() {
    return $(window).width();
};

var initialize = function () {
    //init routing
    page({
        popstate: false,
        click: false,
        dispatch: true
    });

    //Load initial data
    var that = this;
    _state.init({
        callback: function(key) {
            stateChanged(key)
        }
    })
    _state.loadInitialData();

    //Saves reference to the socket
    var url = location.protocol+'//'+location.host;
    socket = io.connect(url);

    loadWindowEvent();
    loadServerEvents();

    return page;
};

var loadWindowEvent = function() {
    //TODO: view is there is a better way to capture and pass events
    $(window).resize(function () {
        homeView.setState({
            docHeight: getDocHeight(),
            docWidth: getDocWidth()
        });
    });
};

//TODO write simple event dispatcher
var stateChanged = function(key) {
    if(homeView) {
        if(_.contains([
            'listboard.added',
            'listboard.removed'
        ], key))
            homeView.setState({ listboards: _state.getAllListboards(), selectedListboard: _state.getSelectedListboard() });
        else if(_.contains([
            'selected.listboard.changed',
            'selected.listboard.container.added',
            'selected.listboard.container.changed',
            'selected.listboard.container.removed',
            'selected.listboard.folder.added',
            'selected.listboard.folder.changed',
            'selected.listboard.folder.removed'
        ], key)){
            homeView.setState({ selectedListboard: _state.getSelectedListboard() });
        }
        else if(_.contains([
            'extension.possible.installed'
        ], key)){
            homeView.setState({ isExtensionInstalled: true});
        }
    }
}

var loadServerEvents = function() {
    require('./events/listboard')(socket);
    require('./events/folder')(socket);
    require('./events/container')(socket);
    require('./events/item')(socket);
};

module.exports = initialize;
