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
        updateLists(item, itemUpdate);
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

    var updateLists = function (item, itemUpdate) {  

        var toRemoveListFilters = _.difference(item.get('lists'), itemUpdate.lists);
        _.chain(toRemoveListFilters)
            .map(function(filter) {
                return _state.getListByFilter(filter);
            })
            .map(function(list) {
                list.removeItem(item.id)
            })

        var toAddListFilters = _.difference(itemUpdate.lists, item.get('lists'));
        _.chain(toAddListFilters)
            .map(function(filter) {
                return _state.getListByFilter(filter);
            })
            .map(function(list) {
                list.addItem(item.id)
            })

    }

    socket.on('create.item', function (data) {
        var item = new Item(data);
        _state.addItemToContainers(item);
        _state.addItemToLists(item);
    });

    socket.on('bulk.create.item', function (data) {
        for (var index in data) {
            var item = new Item(data[index]);
            _state.addItemToContainers(item);
            _state.addItemToLists(item);
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

    //Not used yet, items are not fully deleted, just removed from list and containers
    /*socket.on('delete.item', function (data) {
        _state.removeItemFromContainers(data);
    });

    socket.on('bulk.delete.item', function (data) {
        for (var index in data)
            _state.removeItemFromContainers(data[index]);
    });*/

};