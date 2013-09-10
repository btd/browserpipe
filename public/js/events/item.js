var _state = require('models/state'),
    Item = require('models/item');

module.exports = function (socket) {

    socket.on('create.item', function (data) {
        var item = new Item(data.item);
        _state.addItemToContainers(data.listboardType, data.listboardId, item);
    });

    socket.on('bulk.create.item', function (data) {
        for (var index in data.items) {
            var item = new Item(data.items[index]);
            _state.addItemToContainers(data.listboardType, data.listboardId, item);
        }
    });

    socket.on('delete.item', function (data) {
        _state.removeItemFromContainers(data.listboardType, data.listboardId, data.containerId, data.itemId);
    });

    socket.on('bulk.delete.item', function (data) {
        for (var index in data.items)
            _state.removeItemFromContainers(data.listboardType, data.listboardId, data.items[index].containerId, data.items[index]._id);
    });

};