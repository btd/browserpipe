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
//require('jquery.mousewheel');
//require('perfect.scrollbar');

//Dropdown
require('bootstrap-dropdown');

var homeView, //react home component instance
    socket; //socket.io client socket

var loadHomeView = function() {
    if(!homeView){        
        extension.isExtensionInstalled(function(installed) {
            homeView = HomeView.render(
                _state.laterListboard,
                _state.archiveListboard,
                _state.browserListboards,
                _state.selected1,
                _state.selected2,
                _state.getSelection(),
                installed
            );
        })
    } else {

        homeView.setState({
            selected1: _state.selected1,
            selected2: _state.selected2,
            selection: _state.getSelection()
        }); 
    }

}

page('/', function () {
    setTimeout(function() {
        _state.selected1 = _state.getItemById(_state.archiveListboard);
    }, 0);
});

page('/panel1/item/:id1', function (ctx) {
    setTimeout(function() {
        //_state.onePanel = true;
        var id1 = ctx.params.id1;

        var result = _state.getItemById(id1);

        if(result) {
            _state.selected1 = result;
            _state.selected2 = null;
            loadHomeView();
        } else {
            //page('/');
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
    //Load initial data variable initialOptions global
    _state.loadInitialData(initialOptions);
    stateChanges();

    //init routing
    page({
        popstate: true,
        click: false,
        dispatch: true
    });

    //Saves reference to the socket
    var url = location.protocol+'//'+location.host;
    socket = io.connect(url);

    loadWindowEvent();
    loadServerEvents();

    return page;
};

var loadWindowEvent = function() {
    //TODO: view is there is a better way to capture and pass events
    //$(window).resize(function () {
        //We reset scrollbars
        //$('.scrollable-parent').scrollTop(0);
        //$('.scrollable-parent').perfectScrollbar('update');
    //});
};

var onSelectedPanel1Change = function() {
    var selected = _state.selected1;
    page('/panel1/item/' + selected._id);
    if(homeView) {
        //selection.updateSelectionMessage();
        homeView.setState({
            selected1: selected
        });
    }
};

var onSelectedPanel2Change = function() {
    if(homeView) {
        //selection.updateSelectionMessage();
        homeView.setState({
            selected2: _state.selected2
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
    _state.on('change:selected1', onSelectedPanel1Change);

    _state.on('change:selected2', onSelectedPanel2Change);

    _state.on('change:selection', onSelectionChange);

    var changeInItems = function(item) {
        if(_state.selected1 && (item._id === _state.selected1._id || item.parent === _state.selected1._id))
            homeView.setState({
                selected1: _state.selected1
            });

        if(_state.selected2 && (item._id === _state.selected2._id || item.parent === _state.selected2._id))
            homeView.setState({
                selected2: _state.selected2
            });
    }

    _state.on('change:browserListboards', function() {
        homeView.setState({
            listboards: _state.browserListboards
        });
    });

    _state.items.on('add', changeInItems);
    _state.items.on('remove', changeInItems);
    _state.items.on('change', changeInItems);

    _state.on('extension.possible.installed', function() {
        homeView.setState({
            isExtensionInstalled: true
        });
    });
}

var loadServerEvents = function() {
    //require('./events/listboard')(socket);
    //require('./events/folder')(socket);
    require('./events/user')(socket);
    require('./events/item')(socket);
};

module.exports = initialize;
