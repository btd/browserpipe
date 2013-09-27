var _state = require('../state');

module.exports = function (socket) {

    socket.on('create.listboard', function (newListboard) {
        _state.addListboard(newListboard);            
    });

    socket.on('update.listboard', function (listboardUpdate) {
        _state.updateListboard(listboardUpdate);
    });

    socket.on('delete.listboard', function (listboardId) {
        _state.removeListboard(listboardId); 
    });
};

