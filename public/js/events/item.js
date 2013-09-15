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
                    item.trigger('change:' + key, item);
                }
            })

        updateContainers(item, itemUpdate);
        updateFolders(item, itemUpdate);
    }

    var updateContainers = function (item, itemUpdate) {        

        var toRemoveContainerIds = _.difference(item.get('containers'), itemUpdate.containers);
        _state.getContainersByIds(toRemoveContainerIds).map(function(container) {
            container.removeItem(item.id)
        })

        var toAddContainerIds = _.difference(itemUpdate.containers, item.get('containers'));
        _state.getContainersByIds(toAddContainerIds).map(function(container) {
            container.addItem(item)
        })      

    }

    var updateFolders = function (item, itemUpdate) {  

        var toRemoveFolderFilters = _.difference(item.get('folders'), itemUpdate.folders);
        _.chain(toRemoveFolderFilters)
            .map(function(filter) {
                return _state.getFolderByFilter(filter);
            })
            .map(function(folder) {
                folder.removeItem(item.id)
            })

        var toAddFolderFilters = _.difference(itemUpdate.folders, item.get('folders'));
        _.chain(toAddFolderFilters)
            .map(function(filter) {
                return _state.getFolderByFilter(filter);
            })
            .map(function(folder) {
                folder.addItem(item.id)
            })

    }

    socket.on('create.item', function (data) {
        var item = new Item(data);
        _state.addItemToContainers(item);
        _state.addItemToFolders(item);
    });

    socket.on('bulk.create.item', function (data) {
        for (var index in data) {
            var item = new Item(data[index]);
            _state.addItemToContainers(item);
            _state.addItemToFolders(item);
        }
    });

    socket.on('update.item', function (data) {        
        var item = _state.getItemById(data._id);
        if(item)
            updateDifferences(item, data);
    });

    socket.on('bulk.update.item', function (data) {
        for (var index in data)
            updateDifferences(_state.getItemById(data[index]._id), data[index]);
    });

    //TODO: Not used yet, items are not fully deleted, just removed from folder and containers
    /*socket.on('delete.item', function (data) {
        _state.removeItemFromContainers(data);
    });

    socket.on('bulk.delete.item', function (data) {
        for (var index in data)
            _state.removeItemFromContainers(data[index]);
    });*/

};