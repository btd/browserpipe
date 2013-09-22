var _state = require('models/state')

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

    socket.on('delete.container', function (data) {        
        _state.removeContainer(data.listboardId, data.containerId);        
    });

    socket.on('bulk.delete.container', function (data) {
        for (var index in data) 
            _state.removeContainer(data.listboardId, data.containerIds[index]);              
    });
};

