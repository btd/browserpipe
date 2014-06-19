var _state = require('../state');


module.exports = function (socket) {

  socket.on('create.item', function (newItem) {
    _state.addItem(newItem);
  });

  socket.on('bulk.create.item', function (newItems) {
    for (var index in newItems)
      _state.addItem(newItems[index]);
  });

  socket.on('update.item', function (itemUpdate) {
    _state.updateItem(itemUpdate);
  });

  socket.on('bulk.update.item', function (itemUpdates) {
    for (var index in itemUpdates)
      _state.updateItem(itemUpdates[index]);
  });

};