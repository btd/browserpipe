// Filename: router.js

var _state = require('./state'),
    _ = require('lodash'),
    page = require('page'),
    HomeView = require('./components/home'),
    io = require('socket.io'),
    $ = require('jquery');

var homeView, //react home component instance
    socket; //socket.io client socket

//TODO where is loadNotFoundView ???

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
                _state.getSelectedFolder(),
                installed,
                listboardsVisible,
                listboardSettingsVisible,
                dialogItemVisible
            );
        })
    } else {        
       var selectedListboard = _state.getSelectedListboard();
       var selectedItem = _state.getSelectedItem();
       var selectedFolder = _state.getSelectedFolder();

        homeView.setState({ 
            selectedListboard: selectedListboard,
            selectedItem: selectedItem,
            selectedFolder: selectedFolder,
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

    //Load initial data variable initialOptions global
    _state.loadInitialData(initialOptions);

    //Saves reference to the socket
    var url = location.protocol+'//'+location.host;
    socket = io.connect(url);

    loadWindowEvent();
    loadServerEvents();
    stateChanges();

    return page;
};

var loadWindowEvent = function() {
    //TODO: view is there is a better way to capture and pass events
    $(window).resize(function () {
        if(homeView) {
            homeView.setState({
                docHeight: getDocHeight(),
                docWidth: getDocWidth()
            });
        }
    });
};

var onSelectedListboardChange = function() {
    if(homeView) {
        homeView.setState({
            selectedListboard: _state.getSelectedListboard()
        });
    }
};

var onSelectedItemChange = function() {
    if(homeView) {
        homeView.setState({
            selectedItem: _state.getSelectedItem()
        });
    }
}

var onSelectedFolderChange = function () {
    if(homeView) {
        homeView.setState({
            selectedFolder: _state.getSelectedFolder()
        });
    }
}

var stateChanges = function() {
    _state.on('change:selectedListboard', onSelectedListboardChange);

    _state.on('change:selectedItem', onSelectedItemChange);

    _state.on('change:selectedFolder', onSelectedFolderChange);

    var addedOrDeletedListboard = function() {
        homeView.setState({
            listboards: _state.getAllListboards(),
            selectedListboard: _state.getSelectedListboard()
        });
    }

    _state.listboards.on('add', addedOrDeletedListboard);
    _state.listboards.on('remove', addedOrDeletedListboard);

    _state.on('extension.possible.installed', function() {
        homeView.setState({
            isExtensionInstalled: true
        });
    });
}

var loadServerEvents = function() {
    require('./events/listboard')(socket);
    require('./events/folder')(socket);
    require('./events/container')(socket);
    require('./events/item')(socket);
};

module.exports = initialize;
