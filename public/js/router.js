// Filename: router.js

var _state = require('./state'),
  page = require('page'),
  SidebarComponent = require('./components/sidebar'),
  TabHeaderComponent = require('./components/tabheader'),
  HomeComponent = require('./components/home'),
  BookmarkletArchiveComponent = require('./components/bookmarklet/archive'),
  $ = require('jquery'),
  websocket = require('./websocket/websocket'),
  browser = require('./browser/main');

//Dropdown
require('bootstrap-dropdown');
//Modal
require('bootstrap-modal');
//Notification system
require('messenger');

var sidebarComponent, tabHeaderComponent, homeComponent, bookmarkletArchiveComponent; //react component instances

var loadSidebarComponent = function() {
  if(!sidebarComponent) {
    sidebarComponent = SidebarComponent.render(
      _state.items,
      _state.selectedItem,
      _state.selectedFolder,
      _state.sidebarTab,
      _state.sidebarCollapsed,
      _state.viewScreenshot
    );
  } else {
    sidebarComponent.setState({
      items: _state.items,
      selectedItem: _state.selectedItem,
      selectedFolder: _state.selectedFolder,
      sidebarTab: _state.sidebarTab,
      sidebarCollapsed: _state.sidebarCollapsed,
      viewScreenshot: _state.viewScreenshot
    });
  }
}

var loadTabHeaderComponent = function() {
  if(_state.selectedItem)
    if(!tabHeaderComponent) {
      tabHeaderComponent = TabHeaderComponent.render(
        _state.selectedItem,
        _state.sidebarCollapsed,
        _state.sidebarTab,
        _state.viewScreenshot,
        _state.selectedItem.url
      );
    } else {
      tabHeaderComponent.setState({
        selectedItem: _state.selectedItem,
        sidebarCollapsed: _state.sidebarCollapsed,
        sidebarTab: _state.sidebarTab,
        viewScreenshot: _state.viewScreenshot,
        url: _state.selectedItem.url
      });
    }
}

var loadHomeComponent = function() {
  if(!homeComponent) {
    homeComponent = HomeComponent.render(
      _state.sidebarCollapsed,
      _state.sidebarTab,
      _state.viewScreenshot
    );
  } else {
    homeComponent.setState({
      sidebarCollapsed: _state.sidebarCollapsed,
      sidebarTab: _state.sidebarTab,
      viewScreenshot: _state.viewScreenshot
    });
  }
}

var loadBookmarkletArchiveComponent = function() {
  if(!bookmarkletArchiveComponent) {
     bookmarkletArchiveComponent= BookmarkletArchiveComponent.render(
      _state.selectedFolder
    );
  } else {
    bookmarkletArchiveComponent.setState({
      selectedFolder: _state.selectedFolder
    });
  }
}

var loadTab = function(item) {
  if(item.url) browser.open(item._id, item.url);
}


var showHomeSection = function() {
  $('#tab-section').hide();
  $('#home-section').show();
  $('.uv-icon').show();
}

var hideHomeSection = function() {
  $('#home-section').hide();
  $('#tab-section').show();
  $('.uv-icon').hide();
}

page('/', function() {
  setTimeout(function() {
    _state.selectedItem = null;
    if(!_state.sidebarTab)
      _state.sidebarTab = "archive";
    if(!_state.selectedFolder)
     _state.selectedFolder = _state.archive;
    showHomeSection();
    loadSidebarComponent();
    loadHomeComponent();
  }, 0);
});

page('/item/:id', function(ctx) {
  setTimeout(function() {
    var id = ctx.params.id;
    var item = _state.getItemById(id);
    if(item && item.type !== 2) { //We only navigate to tabs or notes
      _state.selectedItem = item;
      if(!_state.sidebarTab) {
        if(item.deleted) {
          _state.sidebarTab = "trash";
          _state.selectedFolder = _state.archive;
        }
        else {
          _state.sidebarTab = "archive";
          if(item.parent === _state.pending._id)
            _state.selectedFolder = _state.archive;
          else
            _state.selectedFolder = _state.getItemById(item.parent);
        }
      }
      loadSidebarComponent();
      loadTabHeaderComponent();
      loadTab(item);
      hideHomeSection();
    } else {
      page('/');
    }
  }, 0);
});

page('/bookmarklet/archive', function() {
  setTimeout(function() {
    $('#sidebar-section').hide();
    $('#tab-section').hide();
    $('#home-tab-section').hide();
    $('.uv-icon').hide();
    _state.selectedFolder = _state.archive;
    loadBookmarkletArchiveComponent();
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
      if(sidebarComponent)
        loadSidebarComponent();
      if(tabHeaderComponent)
        loadTabHeaderComponent();
      if(homeComponent)
        loadHomeComponent();
      if(bookmarkletArchiveComponent)
        loadBookmarkletArchiveComponent();
    }
  };

  //TODO: improve events to set only what changed
  _state.items.on('add', changeInSelected);
  _state.items.on('remove', changeInSelected);
  _state.items.on('change', changeInSelected);
  _state.on('change:pending', changeInSelected);
  _state.on('change:archive', changeInSelected);
  _state.on('change:selectedItem', changeInSelected);
  _state.on('change:selectedFolder', changeInSelected);
  _state.on('change:sidebarTab', changeInSelected);
  _state.on('change:sidebarCollapsed', changeInSelected);
  _state.on('change:viewScreenshot', changeInSelected);

}

module.exports = initialize;
