// Filename: router.js

var _state = require('./state'),
    _ = require('lodash'),
    page = require('page'),
    extension = require('./extension/extension')
    HomeView = require('./components/home'),
    io = require('socket.io'),
    $ = require('jquery');

//Notification system
require('messenger');
Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-top messenger-on-right'
}
//Scrollbar
require('jquery.mousewheel');
require('perfect.scrollbar');

var homeView, //react home component instance
    socket; //socket.io client socket

//TODO where is loadNotFoundView ???

var loadHomeView = function() {
    if(!homeView){
        var that = this;        
        extension.isExtensionInstalled(function(installed) {
            homeView = HomeView.render(
                _state.getAllListboards(),                
                _state.getPanel1SelectedTypeId(),
                _state.getPanel2SelectedTypeId(),
                _state.getSelection(),
                installed
            );
        })
    } else {        
       var panel1SelectedTypeId = _state.getPanel1SelectedTypeId();
       var panel2SelectedTypeId = _state.getPanel2SelectedTypeId();

        homeView.setState({ 
            panel1SelectedTypeId: panel1SelectedTypeId,
            panel2SelectedTypeId: panel2SelectedTypeId,
            selection: _state.getSelection()
        }); 
    }

}

var unSetPanels = function() {
    _state.unSetPanel1SelectedTypeId();
    _state.unSetPanel2SelectedTypeId();
}

var selectTypeId = function(type, id, callback) {
    //We do the switch to avoid injections
    switch(type){
        case 'listboard' : {             
            if(_state.getListboardById(id)){
                callback('listboard', id); 
                return true;
            }
            break;
        }
        case 'container' : {                
            if(_state.getContainerById(id)){
                callback('container', id); 
                return true;
            }
            break;
        }
        case 'item' : {                
            if(_state.getItemById(id)){
                callback('item', id); 
                return true;
            }
            break;
        }
        case 'folder' : {                
            if(_state.getFolderById(id)){
                callback('folder', id); 
                return true;
            }
            break;
        }
    }
    return false;
}

page('/', function () {
    setTimeout(function() {
        var listboard = _state.getFirstListboard();        
        if(listboard) 
            page('/panel1/listboard/' + listboard._id);      
        else {
            var rootFolder = _state.getRootFolder();
            page('/panel1/folder/' + rootFolder._id);            
        }
    }, 0);
});

page('/panel1/:type1/:id1', function (ctx) {    
    setTimeout(function() {
        var type1 = ctx.params.type1;
        var id1 = ctx.params.id1;
        unSetPanels();        
        var result = selectTypeId(type1, id1, function(type, id) {
            _state.setPanel1SelectedTypeId(type, id)
        });        
        if(result)
            loadHomeView();
        else
            loadNotFoundView();
     }, 0);
});

page('/panel1/:type1/:id1/panel2/:type2/:id2', function (ctx) {    
    setTimeout(function() {
        var type1 = ctx.params.type1;
        var type2 = ctx.params.type2;
        var id1 = ctx.params.id1;
        var id2 = ctx.params.id2;
        unSetPanels();        
        var result1 = selectTypeId(type1, id1, function(type, id) {
            _state.setPanel1SelectedTypeId(type, id)
        });               
        var result2 = selectTypeId(type2, id2, function(type, id) { 
            _state.setPanel2SelectedTypeId(type, id)
        });           
        if(result1 && result2)
            loadHomeView();
        else
            loadNotFoundView();
     }, 0);
});

var initialize = function () {
    //init routing
    page({
        popstate: true,
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
        //We reset scrollbars
        $('.scrollable-parent').scrollTop(0);
        $('.scrollable-parent').perfectScrollbar('update');
    });
};

var onSelectedPanel1Change = function() {
    if(homeView) {
        homeView.setState({
            panel1SelectedTypeId: _state.getPanel1SelectedTypeId()
        });
    }
};

var onSelectedPanel2Change = function() {
    if(homeView) {
        homeView.setState({
            panel2SelectedTypeId: _state.getPanel2SelectedTypeId()
        });
    }
};

var onSelectionChange = function () {
    if(homeView) {
        homeView.setState({
            selection: _state.getSelection()
        });
    }
}

var stateChanges = function() {
    _state.on('change:panel1SelectedTypeId', onSelectedPanel1Change);

    _state.on('change:panel2SelectedTypeId', onSelectedPanel2Change);

    var addedOrDeletedListboard = function() {
        homeView.setState({
            listboards: _state.getAllListboards()
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
