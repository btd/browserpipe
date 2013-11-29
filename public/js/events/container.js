var _state = require('../state'),
    navigation = require('../navigation/navigation');

var removeContainer = function(listboardId, containerId) {
    _state.removeContainer(listboardId, containerId);

    //if we remove it from a panel, we navigate to the listboard that contains it
    if(_state.hasPanel1SelectedTypeObject('container', containerId))
        navigation.updateOnePanel('listboard', listboardId, 1);
    if(_state.hasPanel2SelectedTypeObject('container', containerId))
        navigation.updateOnePanel('listboard', listboardId, 2);
}

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
        removeContainer(data.listboardId, data.container);
    });

    socket.on('bulk.delete.container', function (data) {
        var l = data.containers.length, listboardId = data.listboardId;
        while(l--)
            removeContainer(listboardId, data.containers[l]);
    });
};

