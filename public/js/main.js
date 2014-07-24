require('promise').polyfill();

if (!Promise.spread) {
  Promise.prototype.spread = function (didFulfill, didReject) {
    var that = this;
    return this.then(function (arr) {
      return didFulfill.apply(that, arr);
    }, function (arr) {
      return didReject.apply(that, arr);
    });
  }
}

//add some globals, need to remove them later
process = { env: { NODE_ENV: 'browser' } };
global = window;

$ = jQuery = require('jquery');

var state = require('./state');

state.loadInitialData(initialOptions);

require('./websocket/websocket').initialize();
var page = require('./page');

var React = require('react');
var Home = require('./component/main');
React.renderComponent(Home(), document.getElementById('home'));

var BookmarkletModal = require('./component/bookmarklet-modal');
React.renderComponent(BookmarkletModal(), document.getElementById('bookmarklet-modal'));

var item = require('./data/item'), Item = item.Item, Items = item.Items;

state.on('change:search', function (search) {
  if (typeof search == 'string' && search != '') {
    return new Item({ url: search }).save().then(function (item) {
      var stateItem = state.items.byId(item._id);
      if (!stateItem) {
        state.items.push(item);
      } else {
        item = stateItem;
      }
      item.waitingUpdate = true;
      page.goItem(item);
    });
  } else {
    Items.where(search).then(function (items) {
      state.items = items;
      state.items.forEach(function(item) {
        item.setSynced();
      })
    });
  }
});