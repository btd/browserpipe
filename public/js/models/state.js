var Backbone = require('backbone'),
    Browsers = require('collections/browsers'),
    Listboards = require('collections/listboards'),
    ItemCollection = require('collections/items'),
    Folder = require('models/folder'),
    _ = require('lodash');

var State = Backbone.Model.extend({
    folders: {},
    items: new ItemCollection(),
    loadInitialData: function () {

        //Loads Folders
        this.loadFolders();

        //Loads NowListboards
        this.loadNowListboards();

        //Loads LaterListboards
        this.loadLaterListboards();

        //Loads FutureListboards
        this.loadFutureListboards();

        //Load items
        this.loadItems();
    },
    loadNowListboards: function () {
        this.nowListboards = new Listboards(initialOptions.nowListboards);
    },
    loadLaterListboards: function () {
        this.laterListboards = new (Listboards.Later)(initialOptions.laterListboards);
    },
    loadFutureListboards: function () {
        this.futureListboards = new (Listboards.Future)(initialOptions.futureListboards);
    },
    loadItemsByContainer: function(container) {

        _.map(initialOptions.items, function(item){            
            if(_.contains(item.containers,container.get('_id')))
                container.addItem(item);
        });
    },
    loadFolders: function () {
        //Load children folders
        var initialFolders = initialOptions.folders || [];
        _.each(initialFolders, function (folderItem) {
            var folder = new Folder(folderItem);
            this.folders[folder.getFilter()] = folder;
            if (!_.isEmpty(folder.get('path'))) {
                var parentFolder = this.folders[folder.get('path')];
                parentFolder.addChildren(folder);
            }                        
        }, this);
    },
    addFolder: function (folder) {
        if(!this.folders[folder.getFilter()])
            this.folders[folder.getFilter()] = folder;
    },
    removeFolder: function (folder) {
        var parent = this.getFolderByFilter(folder.get('path'));
        if(parent)
            parent.children.remove(folder);
        this.folders[folder.getFilter()] = null;
    },
    loadBrowsers: function () {        
        this.browsers = new Browsers(initialOptions.browsers)
    },    
    loadItems: function () {
        var self = this;
        for (var index in initialOptions.items) {
            var item = initialOptions.items[index];
            for (var index2 in item.folders) {
                var filter  = item.folders[index2];
                var folder = self.getFolderByFilter(filter);
                if (folder) {
                    if (!folder.items)
                        folder.items = new ItemCollection();
                    folder.addItem(item);
                }
            }
        }        
    },
    //TODO: Now all folders are loaded in memory.
    //      It should loads folders from server in an optmized way
    //      And this method shoud return a promise
    getFolderByFilter: function (filter) {
        return this.folders[filter];
    },
    getItemsByFilter: function (filter) {
        //TODO: load items
        return [];
    },
    getListboard: function(listboardType, listboardId) {
        switch(listboardType){
            case 0: return this.nowListboards.get(listboardId);
            case 1: return this.laterListboards.get(listboardId);
            case 2: return this.futureListboards.get(listboardId);
        }            
    },
    addItemToFolders: function (item) {
        var self = this;
        _.map(item.get('folders'), function (filter) {
            var folder = self.getFolderByFilter(filter);
            if (folder)
                folder.addItem(item);
        });
    },
    addItemToContainers: function (item) {
        var containers = this.getContainersByIds(item.get('containers'));
        _.map(containers, function (container) {
            if(!container.items.get(item.cid))
                container.addItem(item);
        });                
    },
    getItemById: function (id) {
        return this.items.get(id);
    },
    getContainersByIds: function(containerIds) {
        var self = this;
        var listboards = _.union(
            this.nowListboards.models, 
            this.laterListboards.models, 
            this.futureListboards.models
        );   
        return _.chain(listboards)        
            .map(function (listboard) {
                return  self.getContainersByIdsAndListboard(containerIds, listboard);
            })
            .flatten()
            .compact()
            .value();
    },
    getContainersByIdsAndListboard: function(containerIds, listboard) {
        return _.map(containerIds, function (containerId) {
            var container = listboard.containers.get(containerId);
            if(container)
                return container;
        });
    },
    getItemFromContainers: function (listboardType, listboardId, containerId, itemId) {
        var listboard = this.getListboard(listboardType, listboardId);
        if(listboard){
            var container = listboard.containers.get(containerId);
            if(container && container.items.get(itemId))
                return container.items.get(itemId);
        }
        return null;
    },
    removeItemFromContainers: function (item) {
        var containers = this.getContainersByIds(item.containers);
        _.map(containers, function (container) {
            container.removeItem(itemId);
        }); 
    },
    createFolderIfNew: function (filter) {
        var self = this;
        if (filter != 'Folders' && filter.substring(0, 5) != "Folders/")
            return null;
        var defer = $.Deferred();
        var folder = this.getFolderByFilter(filter);
        if (!folder) { //If it does not extists, it creates it
            var index = filter.lastIndexOf('/'); //It has at least one "/"
            var path = filter.substring(0, index);
            var label = filter.substring(index + 1);
            //Gets or creates the parent
            this.createFolderIfNew(path)
                .done(function (parent) {
                    parent.children.createFolder({
                        label: label,
                        path: path
                    })
                    .done(function (folder) {
                        self.addFolder(folder);
                        defer.resolve(folder);
                    });
                });
        }
        else  //Resolves with the folder if existis
            defer.resolve(folder);
        return defer;
    }
});

module.exports = new State();

