// Filename: router.js

var _state = require('./state'),
    page = require('page'),
    DashboardComponent = require('./components/dashboard'),
    TopBarComponent = require('./components/topbar'),
    $ = require('jquery'),
    websocket = require('./websocket/websocket');

//Dropdown
require('bootstrap-dropdown');

var topBarComponent, dashboardComponent; //react component instances

var loadTopBarComponent = function(item) {
    if(!topBarComponent){        
       topBarComponent = TopBarComponent.render(
         item
       );
    } else {
        topBarComponent.setState({
            selected: item
        }); 
    }
}

var loadDashboardComponent = function() {
    if(!dashboardComponent){        
       dashboardComponent = DashboardComponent.render(
         _state.selected
       );
    } else {
        dashboardComponent.setState({
            selected: _state.selected
        }); 
    }
}

var loadPage = function(item) {
  $('#page-section .page-content').contents().find('body').empty();
  websocket.send('browser.open', { itemId: item._id });
}

page('/', function () {
    setTimeout(function() {
	_state.selected = _state.browser;
	loadTopBarComponent();
	loadDashboardComponent();
        $('#topbar-section').show();
        $('#dashboard-section').show();
        $('#page-section').hide();
    }, 0);
});

page('/item/:id', function (ctx) {
    setTimeout(function() {
        var id = ctx.params.id;
        var item = _state.getItemById(id);
        if(item) {
	    if(item.type === 2) {
              _state.selected = item;
	      loadTopBarComponent();
              loadDashboardComponent();
              $('#topbar-section').show();
              $('#dashboard-section').show();
              $('#page-section').hide();
	    }
	    else {
	      loadTopBarComponent(item);
	      loadPage(item);
              $('#topbar-section').show();
              $('#dashboard-section').hide();
              $('#page-section').show();
	    }
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
            dashboardComponent.setState({
                selected: _state.selected
            });
    }

    _state.items.on('add', changeInItems);
    _state.items.on('remove', changeInItems);
    _state.items.on('change', changeInItems);

    var changeInBrowser= function() {
        dashboardComponent.setState({
            browser: _state.browser
        });
    };
    
    _state.browser.on('change', changeInBrowser);
}

module.exports = initialize;
