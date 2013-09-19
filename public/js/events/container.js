var _state = require('models/state')

module.exports = function (socket) {

    var updateDifferences = function (collection, container, containerUpdate) {
        _.each(_.keys(containerUpdate), function (key) {
            if (container.get(key) !== containerUpdate[key]) {
                container.set(key, containerUpdate[key]);
                //Events is not fired automatically
                //collection.trigger('change:' + key, container);
            }
        });
    }

    var createContainer = function(listboard, container) {
        if (listboard && !listboard.containers.get(container.cid))
            listboard.containers.add(container);
    }

    socket.on('create.container', function (data) {
        var listboard = _state.getListboard(data.listboardType, data.listboardId);
        createContainer(listboard, data.container);
    });

    socket.on('bulk.create.container', function (data) {
        var listboard = _state.getListboard(data.listboardType, data.listboardId);
        for (var index in data.containers) 
            createContainer(listboard, data.containers[index])

    });

    socket.on('update.container', function (data) {
        var listboard = _state.getListboard(data.listboardType, data.listboardId);
        if (listboard) {
            var container = listboard.containers.get(data.container._id);
            if (container)
                updateDifferences(listboard.containers, container, data.container);
        }
    });

    var deleteContainer = function(listboard, containerId) {
        if (listboard) {
            var container = listboard.containers.get(containerId);
            if (container)
                listboard.containers.remove(container);
        }
    }

    socket.on('delete.container', function (data) {
        var listboard = _state.getListboard(data.listboardType, data.listboardId);
        deleteContainer(listboard, data.containerId);        
    });

    socket.on('bulk.delete.container', function (data) {
        for (var index in data) {
            var container = data[index];
            var listboard = _state.getListboardByContainerId(container._id);        
            deleteContainer(listboard, container._id);      
        }
        
    });
};

