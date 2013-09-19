var _state = require('models/state')

module.exports = function (socket) {

    var updateDifferences = function (folder, folderUpdate) {
        _.chain(folderUpdate)
            .keys()
            .filter(function (key) {
                return _.contains(['label', 'path'], key);
            })
            .map(function (key) {           
                if (folder.get(key) !== folderUpdate[key]) {                    
                    folder.set(key, folderUpdate[key]);                    
                }
            });
    }

    socket.on('create.folder', function (newFolder) {
        var parent = _state.getFolderByFilter(newFolder.path);
        var folder = parent.children.get(newFolder.cid);
        if (!folder) {            
            folder = new Folder(newFolder);
            _state.addFolder(folder);            
            parent.children.add(folder);
        }        
    });

    var updateFolder= function(folderUpdated) {
        var folder = _state.getFolderById(folderUpdated._id);
        if (folder)
            updateDifferences(folder, folderUpdated);
    }
    
    socket.on('update.folder', function (folderUpdated) {
        updateFolder(folderUpdated);
    });

    socket.on('bulk.update.folder', function (data) {
        for (var index in data)
            updateFolder(data[index]);
    });  

    var deleteFolder = function (folderDeleted) {        
        var folder = _state.getFolderById(folderDeleted._id);
        if (folder) 
            _state.removeFolder(folder);     
    }

    socket.on('delete.folder', function (folderDeleted) {        
        deleteFolder(folderDeleted);
    });

    socket.on('bulk.delete.folder', function (data) {
        for (var index in data)
            deleteFolder(data[index]);
    }); 
};

