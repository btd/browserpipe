// Filename: router.js

var _state = require('./state'),
  page = require('page'),
  DashboardComponent = require('./components/dashboard'),
  TopBarComponent = require('./components/topbar'),
  $ = require('jquery'),
  websocket = require('./websocket/websocket'),
  browser = require('./browser/main');

//Dropdown
require('bootstrap-dropdown');

var topBarComponent, dashboardComponent; //react component instances

var loadTopBarComponent = function() {
  if(!topBarComponent) {
    topBarComponent = TopBarComponent.render(
      _state.selected
    );
  } else {
    topBarComponent.setState({
      selected: _state.selected
    });
  }
}

var loadDashboardComponent = function() {
  if(!dashboardComponent) {
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
  if(item.url) browser.open(item._id, item.url);
}

page('/', function() {
  setTimeout(function() {
    _state.selected = _state.browser;
    loadTopBarComponent();
    loadDashboardComponent();
    $('#topbar-section').show();
    $('#dashboard-section').show();
    $('#page-section').hide();
    $('html, body').removeClass('overflow-hidden');
  }, 0);
});

page('/item/:id', function(ctx) {
  setTimeout(function() {
    var id = ctx.params.id;
    var item = _state.getItemById(id);
    if(item) {
      _state.selected = item;
      if(item.type === 2) {
        loadTopBarComponent();
        loadDashboardComponent();
        $('#topbar-section').show();
        $('#dashboard-section').show();
        $('#page-section').hide();
        $('html, body').removeClass('overflow-hidden');
      }
      else {
        loadTopBarComponent();
        loadPage(item);
        $('#topbar-section').show();
	$('.url-input').focus();
        $('#dashboard-section').hide();
        $('#page-section').show();
        $('html, body').addClass('overflow-hidden');
      }
    } else {
      page('/');
    }
  }, 0);
});

var initialize = function() {
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
    if(dashboardComponent && _state.selected &&
      ((item._id === _state.selected._id && item.type === 2) || item.parent === _state.selected._id)
      )
      dashboardComponent.setState({
        selected: _state.selected
      });
  }

  _state.items.on('add', changeInItems);
  _state.items.on('remove', changeInItems);
  _state.items.on('change', changeInItems);

  var changeInBrowser = function() {
    if(dashboardComponent)
      dashboardComponent.setState({
        browser: _state.browser
      });
  };

  _state.browser.on('change', changeInBrowser);
}

module.exports = initialize;
