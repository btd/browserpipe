// Filename: router.js

var _state = require('./state'),
    page = require('page'),
    HomeView = require('./components/home'),
    BrowserView = require('./components/browser'),
    $ = require('jquery'),
    websocket = require('./websocket/websocket');

//Dropdown
require('bootstrap-dropdown');

var homeView, browserView; //react home component instance

var loadHomeView = function() {
    $('#home-section').show();
    $('#browser-section').hide();
    if(!homeView){        
       homeView = HomeView.render(
         _state.browser,
         _state.selected
       );
    } else {
        homeView.setState({
            selected: _state.selected
        }); 
    }
}

var loadBrowserView = function(item) {
    $('#home-section').hide();
    $('#browser-section').show();
    if(!browserView){        
       browserView = BrowserView.render(
         item
       );
    } else {
        browserView.setState({
            selected: item
        }); 
    }
}

page('/', function () {
    setTimeout(function() {
	if(_state.browser.items.length > 0)
	  page('/item/' + _state.browser.items[0]); 
	else {
	  _state.selected = null;
	  loadHomeView();
	}
    }, 0);
});

page('/item/:id', function (ctx) {
    setTimeout(function() {
        var id = ctx.params.id;
        var item = _state.getItemById(id);
        if(item) {
	    if(item.type === 2) {
              _state.selected = item;
              loadHomeView();
	    }
	    else
	      loadBrowserView(item);
        } else {
            page('/');
        }
     }, 0);
});

var initialize = function () {
    //Load initial data variable initialOptions global
    _state.loadInitialData(initialOptions);
    stateChanges();
    
    //initi sockets
    websocket.initialize(); 
    
    //init routing
    page({
        popstate: true,
        click: false,
        dispatch: true
    });

    return page;
};

var stateChanges = function() {

    var changeInItems = function(item) {
        if(_state.selected && (item._id === _state.selected._id || item.parent === _state.selected._id))
            homeView.setState({
                selected: _state.selected
            });
    }

    _state.items.on('add', changeInItems);
    _state.items.on('remove', changeInItems);
    _state.items.on('change', changeInItems);

    var changeInBrowser= function() {
        homeView.setState({
            browser: _state.browser
        });
    };
    
    _state.browser.on('change', changeInBrowser);
}

module.exports = initialize;
