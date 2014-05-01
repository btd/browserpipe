// Filename: router.js

var _state = require('./state'),
  page = require('page'),
  SidebarComponent = require('./components/sidebar'),
  TabHeaderComponent = require('./components/tabheader'),
  NewTabComponent = require('./components/newtab'),
  $ = require('jquery'),
  websocket = require('./websocket/websocket'),
  browser = require('./browser/main');

//Dropdown
require('bootstrap-dropdown');
//Modal
require('bootstrap-modal');
//Notification system
require('messenger');
//Scrollbar
require('perfect-scrollbar');

var sidebarComponent, tabHeaderComponent, newTabComponent; //react component instances
var isIframe = (window != window.parent);

var loadSidebarComponent = function() {
  if(!sidebarComponent) {
    sidebarComponent = SidebarComponent.render(
      _state.items,
      _state.selectedItem,
      _state.selectedFolder,
      _state.sidebarTab
    );
  } else {
    sidebarComponent.setState({
      items: _state.items,
      selectedItem: _state.selectedItem,
      selectedFolder: _state.selectedFolder,
      sidebarTab: _state.sidebarTab
    });
  }
}

var loadTabHeaderComponent = function() {
  if(_state.selectedItem)
    if(!tabHeaderComponent) {
      tabHeaderComponent = TabHeaderComponent.render(
        _state.selectedItem
      );
    } else {
      tabHeaderComponent.setState({
        selectedItem: _state.selectedItem
      });
    }
}

var loadNewTabComponent = function() {
  if(!newTabComponent) {
    newTabComponent = NewTabComponent.render(
    );
  }
}

var loadTab = function(item) {
  if(item.url) browser.open(item._id, item.url);
}


var showNewTabSection = function() {
  $('#tab-section').hide();
  $('#new-tab-section').show();
}

var hideNewTabSection = function() {
  $('#new-tab-section').hide();
  $('#tab-section').show();
}

var navigateToFirstChild = function(parent) {
  if(parent.items.length === 0)
    page('/new');
  else
    page('/item/' + parent.items[0]._id);
}

page('/', function() {
  setTimeout(function() {
    navigateToFirstChild(_state.browser);
  }, 0);
});

page('/new', function() {
  setTimeout(function() {
    _state.selectedItem = null;
    _state.sidebarTab = "browser";
    if(!_state.selectedFolder)
     _state.selectedFolder = _state.archive;
    showNewTabSection();
    loadSidebarComponent();
    loadNewTabComponent();
  }, 0);
});

page('/item/:id', function(ctx) {
  setTimeout(function() {
    var id = ctx.params.id;
    var item = _state.getItemById(id);
    if(item && item.type !== 2) { //We only navigate to tabs or notes
      _state.selectedItem = item;
      if(!_state.sidebarTab) {
        if(item.browserParent) {
          _state.sidebarTab = "browser";
          if(item.archiveParent)
            _state.selectedFolder = _state.getItemById(item.archiveParent);
          else
            _state.selectedFolder = _state.archive;
        }
        else if(item.archiveParent) {
          _state.sidebarTab = "archive";
          _state.selectedFolder = _state.getItemById(item.archiveParent);
        }
        else {
          _state.sidebarTab = "recent";
          _state.selectedFolder = _state.archive;
        }
      }
      loadSidebarComponent();
      loadTabHeaderComponent();
      loadTab(item);
      hideNewTabSection();
    } else {
      page('/new'); //we can send it better to a page of not found
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
      loadSidebarComponent();
      loadTabHeaderComponent();
    }
  };

  //TODO: improve events to set only what changed
  _state.items.on('add', changeInSelected);
  _state.items.on('remove', changeInSelected);
  _state.items.on('change', changeInSelected);
  _state.on('change:browser', changeInSelected);
  _state.on('change:archive', changeInSelected);
  _state.on('change:selectedItem', changeInSelected);
  _state.on('change:selectedFolder', changeInSelected);
  _state.on('change:sidebarTab', changeInSelected);

}

module.exports = initialize;
