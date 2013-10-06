// Filename: router.js

var _state = require('./state'),
    _ = require('lodash'),
    page = require('page'),
    HomeView = require('./components/home'),
    io = require('socket.io'),
    $ = require('jquery');

var homeView, //react home component instance
    socket; //socket.io client socket

var loadHomeView = function(listboardsVisible, listboardSettingsVisible, dialogItemVisible) {
    if(!homeView){
        var that = this;
        _state.isExtensionInstalled(function(installed) {
            homeView = HomeView.render(
                getDocHeight(),
                getDocWidth(),
                _state.getAllListboards(),
                _state.getSelectedListboard(),
                _state.getSelectedItem(),
                installed,
                listboardsVisible,
                listboardSettingsVisible,
                dialogItemVisible
            );
        })
    } else {
       var selectedListboard = _state.getSelectedListboard();
       var selectedItem = _state.getSelectedItem();
        homeView.setState({ 
            selectedListboard: selectedListboard,
            selectedItem: selectedItem,
            listboardsVisible: listboardsVisible,
            listboardSettingsVisible: listboardSettingsVisible,
            dialogItemVisible: dialogItemVisible
        }); 
    }
}

page('/', function () {
    setTimeout(function() {
        page('/listboards');
    }, 0);
});

page('/listboards', function () {
    setTimeout(function() {
        _state.selectFirstListboard();
        var selectedListboard = _state.getSelectedListboard();
        if(selectedListboard)
            page('/listboard/' + selectedListboard._id);
        else
            loadHomeView(true, false, false);
    }, 0);
});

page('/listboard/:id', function (ctx) {    
    setTimeout(function() {
        var id = ctx.params.id;
        if(_state.getListboardById(id)){
            _state.setSelectedListboard(id);        
            loadHomeView(true, false, false);
        }
        else
            loadNotFoundView();
     }, 0);
});

page('/listboard/:id/settings', function (ctx) {
    setTimeout(function() {
        var id = ctx.params.id;
        if(_state.getListboardById(id)){
            _state.setSelectedListboard(id);        
            loadHomeView(false, true, false);    
        }
        else
            loadNotFoundView();
     }, 0);    
});

page('/item/:id', function (ctx) {    
    setTimeout(function() {        
        var id = ctx.params.id;
        if(_state.getItemById(id)){
            _state.setSelectedItem(id);        
            //If loaded for the first time, there is no selected listboard, so we select one
            //TODO: select the first listboard that contains the item
            if(!_state.getSelectedListboard())
                _state.selectFirstListboard();
            loadHomeView(true, false, true);
        }
        else
            loadNotFoundView();
     }, 0);
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
    });    
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
            homeView.setState({ 
                listboards: _state.getAllListboards(), 
                selectedListboard: _state.getSelectedListboard() 
            });
        else if(_.contains([
            'selected.listboard.changed',
            'selected.listboard.container.added',
            'selected.listboard.container.changed',
            'selected.listboard.container.removed',
            'selected.listboard.folder.added',
            'selected.listboard.folder.changed',
            'selected.listboard.folder.removed'
        ], key)){            
            homeView.setState({ 
                selectedListboard: _state.getSelectedListboard() 
            });
        }
        else if(_.contains([
            'selected.item.changed'
        ], key)){
            homeView.setState({
                selectedItem: _state.getSelectedItem()
            });
        }
        else if(_.contains([
            'extension.possible.installed'
        ], key)){
            homeView.setState({ 
                isExtensionInstalled: true
            });
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
