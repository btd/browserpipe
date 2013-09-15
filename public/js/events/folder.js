var _state = require('models/state')

module.exports = function (socket) {

    var updateDifferences = function (folder, folderUpdate) {
        _.each(_.keys(folderUpdate), function (key) {
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

    //TODO: Not implemented yet the update of folders
    /*socket.on('update.folder', function (folderUpdated) {
        var folder = _state.getListboard(folderUpdate.type, folderUpdate._id);
        if (folder)
            updateDifferences(folder, folderUpdate);
    });*/

    socket.on('delete.folder', function (folderDeleted) {
        var filter =  folderDeleted.path + "/" + folderDeleted.label;
        var folder = _state.getFolderByFilter(filter);
        if (folder) 
            _state.removeFolder(folder);         
    });
};

