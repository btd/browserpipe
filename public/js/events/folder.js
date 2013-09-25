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

    socket.on('delete.folder', function (folder) {        
        _state.removeFolder(folder._id);
    });

    socket.on('bulk.delete.folder', function (folders) {
        for (var index in folders)
            _state.removeFolder(folders[index]._id);
    }); 
};

