// Filename: router.js

var _state = require('./state'),
  page = require('page'),
  DashboardComponent = require('./components/dashboard'),
  PageHeaderComponent = require('./components/pageheader'),
  $ = require('jquery'),
  websocket = require('./websocket/websocket'),
  browser = require('./browser/main');

//Dropdown
require('bootstrap-dropdown');
//Modal
require('bootstrap-modal');
//Notification system
require('messenger');

var dashboardComponent, pageHeaderComponent; //react component instances
var isIframe = (window != window.parent);

var loadDashboardComponent = function() {
  if(!dashboardComponent) {
    dashboardComponent = DashboardComponent.render(
      isIframe,
      _state.selectedFolder,
      _state.selectedItem
    );
  } else {
    dashboardComponent.setState({
      isIframe: isIframe,
      selectedFolder: _state.selectedFolder,
      selectedItem: _state.selectedItem
    });
  }
}

var loadPageHeaderComponent = function() {
  if(_state.selectedItem)
    if(!pageHeaderComponent) {
      pageHeaderComponent = PageHeaderComponent.render(
        isIframe,
        _state.selectedFolder,
        _state.selectedItem
      );
    } else {
      pageHeaderComponent.setState({
        isIframe: isIframe,
        selectedFolder: _state.selectedFolder,
        selectedItem: _state.selectedItem
      });
    }
}

var loadPage = function(item) {
  if(isIframe)
    window.parent.postMessage("expand", "*");
  if(item.url) browser.open(item._id, item.url);
}


var prepareDashboardElements = function() {
  $('#page-section').hide();
  $('html, body').removeClass('overflow-hidden');
}

var prepareTabElements = function() {
  $('#page-section').show();
  $('html, body').addClass('overflow-hidden');
}

page('/', function() {
  setTimeout(function() {
    _state.selectedItem = null;
    _state.selectedFolder = _state.browser;
    loadDashboardComponent();
    loadPageHeaderComponent();
    prepareDashboardElements();
  }, 0);
});

page('/item/:id', function(ctx) {
  setTimeout(function() {
    var id = ctx.params.id;
    var item = _state.getItemById(id);
    if(item) {
      if(item.type === 2) {
        _state.selectedItem = null;
        _state.selectedFolder = item;
        loadDashboardComponent();
        loadPageHeaderComponent();
        prepareDashboardElements();
      }
      else {
        _state.selectedItem = item;
        if(!_state.selectedFolder)
          _state.selectedFolder = _state.getItemById(item.parent);
        loadDashboardComponent();
        loadPageHeaderComponent();
        loadPage(item);
        prepareTabElements();
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

  var changeInSelected = function() {
    if(_state.selectedFolder) { //This means load finished
      loadDashboardComponent();
      loadPageHeaderComponent();
    }
  };

  _state.items.on('add', changeInSelected);
  _state.items.on('remove', changeInSelected);
  _state.items.on('change', changeInSelected);
  _state.on('change:selectedFolder', changeInSelected);
  _state.on('change:selectedItem', changeInSelected);
}

module.exports = initialize;
