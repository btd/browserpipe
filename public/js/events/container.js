var _state = require('../state'),
    navigation = require('../navigation/navigation');

var removeContainer = function(listboardId, containerId) {
    _state.removeContainer(listboardId, containerId);

    var updatePanelOne = false, updatePanelTwo = false;
    if(_state.hasPanel1SelectedTypeObject('container', containerId))
        updatePanelOne = true;
    if(_state.hasPanel2SelectedTypeObject('container', containerId))
        updatePanelTwo = true;

    //if we need to update a panel
    if(updatePanelOne || updatePanelTwo) {    
        var laterBoard = _state.getLaterListboard();
        if(listboardId !== laterBoard._id){
            //if we remove it from a listboard.type == 0, we navigate to the listboard that contains it
            if(updatePanelOne)
                navigation.updateOnePanel('listboard', listboardId, 1);
            if(updatePanelTwo)
                navigation.updateOnePanel('listboard', listboardId, 2);
        }
        else {
            //If not we navigate to the root folder
            var rootFolder = _state.getRootFolder();
            if(updatePanelOne)
                navigation.updateOnePanel('folder', rootFolder._id, 1);
            if(updatePanelTwo)
                navigation.updateOnePanel('folder', rootFolder._id, 2);
        }
    }

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

