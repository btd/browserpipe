var _state = require('../state'),
    navigation = require('../navigation/navigation');


var removeFolder = function(folderId) {
    var folder = _state.getFolderById(folderId);
    var parent = _state.getFolderByFilter(folder.path);
    
    _state.removeFolder(folderId);

    //if we remove it from a panel, we set the parent
    if(_state.hasPanel1SelectedTypeObject('folder', folderId))
        navigation.updateOnePanel('folder', parent._id , 1);
    if(_state.hasPanel2SelectedTypeObject('folder', folderId))
        navigation.updateOnePanel('folder', parent._id , 2);
}

module.exports = function (socket) {

    socket.on('create.folder', function (newFolder) {
        _state.addFolder(newFolder);       
    });
    
    socket.on('update.folder', function (folderUpdate) {
        _state.updateFolder(folderUpdate);
    });

    socket.on('bulk.update.folder', function (folderUpdates) {
        for (var index in folderUpdates)
            _state.updateFolder(folderUpdates[index]);
    }); 

    socket.on('delete.folder', function (folderId) {        
        removeFolder(folderId);
    });

    socket.on('bulk.delete.folder', function (folderIds) {
        for (var index in folderIds)
            removeFolder(folderIds[index]);
    }); 
};

