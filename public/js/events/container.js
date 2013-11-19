var _state = require('../state')

module.exports = function (socket) {
   

    socket.on('create.container', function (data) {        
        _state.addContainer(data.listboardId, data.container);
    });

    socket.on('bulk.create.container', function (data) {
        for (var index in data.containers) 
            _state.addContainer(data.listboardId, data.containers[index])
    });

    socket.on('update.container', function (data) {
        _state.updateContainer(data.listboardId, data.container);
    });

    socket.on('bulk.update.container', function (data) {
        for (var index in data.containers)             
            _state.updateContainer(data.listboardId, data.containers[index])
    });

    socket.on('delete.container', function (data) {        
        _state.removeContainer(data.listboardId, data.container);
    });

    socket.on('bulk.delete.container', function (data) {
        var l = data.containers.length, listboardId = data.listboardId;
        while(l--) {
            _state.removeContainer(listboardId, data.containers[l]);
        }
    });
};

