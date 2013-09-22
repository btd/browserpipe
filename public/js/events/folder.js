var _state = require('models/state')

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
        _state.removeFolder(folderId);
    });

    socket.on('bulk.delete.folder', function (folderIds) {
        for (var index in folderIds)
            _state.removeFolder(folderIds[index]);
    }); 
};

