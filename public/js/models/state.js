var Backbone = require('backbone'),
    Browsers = require('collections/browsers'),
    Listboards = require('collections/listboards'),
    FolderCollection = require('collections/folders'),
    ItemCollection = require('collections/items'),
    Folder = require('models/folder'),
    _ = require('lodash');

var State = Backbone.Model.extend({
    foldersHash: {},
    folders: new FolderCollection(),
    items: new ItemCollection(),
    loadInitialData: function () {

        //Loads Folders
        this.loadFolders();

        //Loads Listboards
        this.loadListboards();

        //Load items
        this.loadItems();
    },

    //////////////////////////////////////////FOLDERS//////////////////////////////////////
    loadFolders: function () {
        //Load children folders
        var initialFolders = initialOptions.folders || [];
        _.each(initialFolders, function (folderItem) {
            var folder = new Folder(folderItem);
            this.folders.add(folder);
            this.foldersHash[folder.getFilter()] = folder;
            if (!_.isEmpty(folder.get('path'))) {
                var parentFolder = this.foldersHash[folder.get('path')];
                parentFolder.addChildren(folder);
            }                        
        }, this);

        this.listenTo(this.folders, 'change:path', this.folderFilterChanged, this);
        this.listenTo(this.folders, 'change:label', this.folderFilterChanged, this);
    },
    addFolder: function (folder) {
        this.folders.add(folder);
        if(!this.foldersHash[folder.getFilter()])
            this.foldersHash[folder.getFilter()] = folder;        
    },
    removeFolder: function (folder) {
        this.folders.remove(folder);
        var parent = this.getFolderByFilter(folder.get('path'));
        if(parent)
            parent.children.remove(folder);
        this.foldersHash[folder.getFilter()] = null;
    },
    folderFilterChanged: function (folder) {
         this.foldersHash[folder.getPreviousFilter()] = null;
         this.foldersHash[folder.getFilter()] = folder;         
    },
    //TODO: Now all folders are loaded in memory.
    //      It should loads folders from server in an optmized way
    //      And this method shoud return a promise
    getFolderByFilter: function (filter) {
        return this.foldersHash[filter];
    },
    getFolderById: function (folderId) {
        return this.folders.get(folderId);
    },
    getAllFolders: function() {
        return this.folders.models;
    },
    createFolderIfNew: function (filter) {
        var self = this;
        if (filter != 'Folders' && filter.substring(0, 8) != "Folders/")
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
    },
    //////////////////////////////////////////FOLDERS//////////////////////////////////////


    //////////////////////////////////////////LISTBOARDS//////////////////////////////////////
    loadListboards: function() {
        this.listboards = new Listboards(initialOptions.listboards);
        this.selectedListboard = this.listboards.at(0);
    },    
    getListboardById: function(listboardId) {
        return this.listboards.get(listboardId);          
    },
    getAllListboards: function() {
        return this.listboards;
    },
    getSelectedListboard: function() {
        return this.selectedListboard;
    },
    setSelectedListboard: function(listboardId) {
        this.selectedListboard = this.getListboardById(listboardId);
        this.trigger('selected.listboard.changed');
    },

    //////////////////////////////////////////LISTBOARDS//////////////////////////////////////


    //////////////////////////////////////////ITEMS//////////////////////////////////////
    loadItems: function () {
        var self = this;
        for (var index in initialOptions.items) {
            var item = initialOptions.items[index];
            for (var index2 in item.folders) {
                var folderId  = item.folders[index2];
                var folder = self.folders.get(folderId);
                if (folder) {
                    if (!folder.items)
                        folder.items = new ItemCollection();
                    folder.addItem(item);
                }
            }
        }        
    },
    loadItemsByContainer: function(container) {
        _.map(initialOptions.items, function(item){            
            if(_.contains(item.containers,container.get('_id')))
                container.addItem(item);
        });
    },
    addItemToFolders: function (item) {
        var self = this;
        _.map(item.get('folders'), function (folderId) {
            var folder = self.folders.get(folderId);
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
    getItemByCId: function (cid) {
        return this.items.get(cid);
    },
    getListboardByContainerId: function(containerId) {
        var self = this;          
        return _.first(
            _.chain(this.listboards)        
            .map(function (listboard) {
                if(listboard.containers.get(containerId))
                    return listboard;
            })
            .flatten()
            .compact()            
            .value()
        );
    },
    getContainersByIds: function(containerIds) {
        var self = this;
        return _.chain(this.listboards)        
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
    }
    //////////////////////////////////////////ITEMS//////////////////////////////////////


    
});

module.exports = new State();

