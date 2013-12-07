// Filename: router.js

var _state = require('./state'),
    page = require('page'),
    navigation = require('./navigation/navigation'),
    extension = require('./extension/extension'),
    HomeView = require('./components/home'),
    io = require('socket.io'),
    $ = require('jquery'),
    selection = require('./selection/selection');

//Notification system
require('messenger');
Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right'
}

//Scrollbar
require('jquery.mousewheel');
require('perfect.scrollbar');

//Dropdown
require('bootstrap-dropdown');

var homeView, //react home component instance
    socket; //socket.io client socket

var loadHomeView = function() {
    if(!homeView){        
        extension.isExtensionInstalled(function(installed) {
            homeView = HomeView.render(
                _state.getLaterListboard(),
                _state.getAllBrowserListboards(), 
                _state.onePanel,               
                _state.getPanel1SelectedTypeObject(),
                _state.getPanel2SelectedTypeObject(),
                _state.getSelection(),
                installed
            );
        })
    } else {        
       var panel1SelectedTypeObject = _state.getPanel1SelectedTypeObject();
       var panel2SelectedTypeObject = _state.getPanel2SelectedTypeObject();
       var onePanel = _state.onePanel;

        homeView.setState({ 
            onePanel: onePanel,
            panel1SelectedTypeObject: panel1SelectedTypeObject,
            panel2SelectedTypeObject: panel2SelectedTypeObject,
            selection: _state.getSelection()
        }); 
    }

}

var selectTypeObject = function(type, param, callback) {
    //We do the switch to avoid injections
    switch(type){
        case 'listboard' : {             
            var listboard = _state.getListboardById(param);
            if(listboard){
                callback('listboard', listboard); 
                return true;
            }
            break;
        }
        case 'container' : {  
            var container = _state.getContainerById(param);
            if(container){
                callback('container', container); 
                return true;
            }
            break;
        }
        case 'item' : {                
            var item = _state.getItemById(param);
            if(item){
                callback('item', item); 
                return true;
            }
            break;
        }
        case 'folder' : {                
            var folder = _state.getFolderById(param);
            if(folder){
                callback('folder', folder); 
                return true;
            }
            break;
        }
        case 'search' : {                
            _state.searchItem(param, function(result){
                if(!result)
                    result = [];
                callback('search', result); 
            });
            return true;
        }
        case 'selection' : {                
            var selection = _state.getSelection();
            if(selection){
                callback('selection', selection); 
                return true;
            }
            break;
        }
    }
    return false;
}

page('/', function () {
    setTimeout(function() {
        var rootFolder = _state.getRootFolder();
        page('/panel1/folder/' + rootFolder._id);            
    }, 0);
});

page('/panel1/:type1/:id1', function (ctx) {    
    setTimeout(function() {
        _state.onePanel = true;
        var type1 = ctx.params.type1;
        var id1 = ctx.params.id1;        
        var result = selectTypeObject(type1, id1, function(type, object) {
            _state.setPanel1SelectedTypeObject(type, object)
        });        
        if(result)
            loadHomeView();
        else {
            var rootFolder = _state.getRootFolder();
            page('/panel1/folder/' + rootFolder._id);     
        }
     }, 0);
});

page('/panel1/:type1/:id1/panel2/:type2/:id2', function (ctx) {    
    setTimeout(function() {
        _state.onePanel = false;
        var type1 = ctx.params.type1;
        var type2 = ctx.params.type2;
        var id1 = ctx.params.id1;
        var id2 = ctx.params.id2;        
        var result1 = selectTypeObject(type1, id1, function(type, object) {
            _state.setPanel1SelectedTypeObject(type, object)
        });               
        var result2 = selectTypeObject(type2, id2, function(type, object) { 
            _state.setPanel2SelectedTypeObject(type, object)
        });           
        if(result1 && result2)
            loadHomeView();
        else {
            var rootFolder = _state.getRootFolder();
            if(!result1) 
                navigation.updateOnePanel('folder', rootFolder._id, 1);
            else if(!result2)
                navigation.updateOnePanel('folder', rootFolder._id, 2);
        }
            
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
        selection.updateSelectionMessage();
        homeView.setState({
            panel1SelectedTypeObject: _state.getPanel1SelectedTypeObject()
        });
    }
};

var onSelectedPanel2Change = function() {
    if(homeView) {
        selection.updateSelectionMessage();
        homeView.setState({
            panel2SelectedTypeObject: _state.getPanel2SelectedTypeObject()
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
    _state.on('change:panel1SelectedTypeObject', onSelectedPanel1Change);

    _state.on('change:panel2SelectedTypeObject', onSelectedPanel2Change);

     _state.on('change:selection', onSelectionChange);

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
