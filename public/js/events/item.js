var _state = require('models/state'),
    Item = require('models/item');

module.exports = function (socket) {

    var updateDifferences = function (item, itemUpdate) {
        _.chain(itemUpdate)
            .keys()
            .filter(function (key) {
                return _.contains(['title', 'url', 'note'], key);
            })
            .map(function (key) {           
                if (item.get(key) !== itemUpdate[key]) {
                    item.set(key, itemUpdate[key]);                    
                }
            })

        updateContainers(item, itemUpdate);
        updateFolders(item, itemUpdate);
    }

    var updateContainers = function (item, itemUpdate) {        

        var toRemoveContainerIds = _.difference(item.get('containers'), itemUpdate.containers);
        _state.getContainersByIds(toRemoveContainerIds).map(function(container) {
            if(container)
                container.removeItem(item.id)
        })

        var toAddContainerIds = _.difference(itemUpdate.containers, item.get('containers'));
        _state.getContainersByIds(toAddContainerIds).map(function(container) {
            if(!container.getItems().get(item.cid))
                container.addItem(item)
        })      

        if(toRemoveContainerIds.length > 0 || toAddContainerIds.length > 0)
            item.set('containers', itemUpdate.containers)

    }

    var updateFolders = function (item, itemUpdate) {  

        var toRemoveFolderIds = _.difference(item.get('folders'), itemUpdate.folders);
        _.chain(toRemoveFolderIds)
            .map(function(folderId) {
                return _state.getFolderById(folderId);
            })
            .map(function(folder) {
                if(folder)
                    folder.removeItem(item.id);
            })

        var toAddFolderIds = _.difference(itemUpdate.folders, item.get('folders'));
        _.chain(toAddFolderIds)
            .map(function(folderId) {
                return _state.getFolderById(folderId);
            })
            .map(function(folder) {  
                if(!folder.getItems().get(item.cid))
                    folder.addItem(item);
            })

        if(toRemoveFolderIds.length > 0 || toAddFolderIds.length > 0)
            item.set('folders', itemUpdate.folders)
    }

    var createItem = function(data) {
        if(!_state.getItemByCId(data.cid)) {
            var item = new Item(data);
            _state.addItemToContainers(item);
            _state.addItemToFolders(item);
        }
    }

    socket.on('create.item', function (data) {
        createItem(data);
    });

    socket.on('bulk.create.item', function (data) {
        for (var index in data)
            createItem(data[index]);
    });

    var updateItem = function(data) {
        var item = _state.getItemById(data._id);
        if(item)
            updateDifferences(item, data);
    }

    socket.on('update.item', function (data) {        
        updateItem(data);
    });

    socket.on('bulk.update.item', function (data) {
        for (var index in data)
            updateItem(data[index]);
    });   

};