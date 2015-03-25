var page = require('page');

var state = require('./state');

page.redirect = function(to) {
  setTimeout(function() {
    page(to);
  }, 0);
};

page('/', function (ctx) {
  state.selectedItem = null;
});

page('/item/:id', function (ctx) {
  var id = ctx.params.id;
  var item = state.getItemById(id);
  if (item) { //We only navigate to tabs or notes
    state.selectedItem = item;
  } else {
    page.redirect('/');
  }
});

//init routing
page({
  popstate: true,
  click: false,
  dispatch: true
});

exports.goHome = function() {
  page('/');
}

exports.goItem = function(itemId) {
  var id = typeof itemId == 'string' ? itemId: itemId._id;
  page('/item/' + id);
}