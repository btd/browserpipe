var $ = require('jquery'),
    _ = require('lodash');

var State = {
    init: function(options){
        this.callback = options.callback;
    },
    loadInitialData: function () {

        //Loads Folders
        this.loadFolders();

        //Loads Listboards
        this.loadListboards();

        //Load items
        this.loadItems();
    },



    //////////////////////////////////////////FOLDERS//////////////////////////////////////
    //Load
    loadFolders: function () {
        //Load children folders
        var self = this;             
        this.folders = [];
        this.foldersHash = {};
        _.each(initialOptions.folders || [], function (folder) {            
               self.addFolder(folder);
        }, this);
    },


    //Gets
    getFolderFilter: function(folder) {
        return (folder.path === "" ? "" : folder.path + "/") + folder.label;
    },
    //TODO: Now all folders are loaded in memory.
    //      It should loads folders from server in an optmized way
    //      And this method shoud return a promise
    getFolderByFilter: function (filter) {
        return this.foldersHash[filter];
    },
    getFolderById: function (folderId) {
        return _.findWhere(this.folders, {_id: folderId});
    },
    getAllFolders: function() {
        return this.folders;
    },  


    //CRUD
    addFolder: function (folder) {
        folder.children = [];
        folder.items = [];
        this.folders.push(folder);       
        this.foldersHash[this.getFolderFilter(folder)] = folder;
        if (!_.isEmpty(folder.path)) {
            var parentFolder = this.foldersHash[folder.path];
            parentFolder.children.push(folder);            
            if(this.getSelectedListboard() 
                && this.getContainerByFolder(this.getSelectedListboard(), folder._id))
                this.callback('selected.listboard.folder.added');
        }  
    },
    updateFolder: function(folderUpdate) {
        var folder =  this.getFolderById(folderUpdate._id);
        if (folder) {
            _.extend(folder, folderUpdate);
            if(this.getSelectedListboard() 
                && this.getContainerByFolder(this.getSelectedListboard(), folder._id))
                this.callback('selected.listboard.folder.changed');
        }
    }, 
    removeFolder: function (folderId) {
        var folder =  this.getFolderById(folderId);
        if(folder) {
            this.folders = _.without(this.folders, folder);
            var parent = this.getFolderByFilter(folder.path);
            if(parent)
                parent.children = _.without(parent.children, folder);
            this.foldersHash[this.getFolderFilter(folder)] = null;
            if(this.getSelectedListboard() 
                && this.getContainerByFolder(this.getSelectedListboard(), parent._id))
                this.callback('selected.listboard.folder.removed');
        }
    },     
    createFolderIfNew: function (filter, success) {
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
            return this.createFolderIfNew(path, function(){
                self.saveFolder({
                    label: label,
                    path: path
                }, success)
            });
        }
        else  //Resolves with the folder if existis
            success();
    },


    //Server calls    
    saveFolder: function(folder, success) {
        return $.ajax({
            url: '/folders',
            type: 'POST', 
            data: JSON.stringify(folder),
            dataType: "json",
            success: success
        });
    },    
    updateFolder: function(folder, success){
        return $.ajax({
            url: '/folders/' + folder._id,
            type: "PUT", 
            data: JSON.stringify(folder),
            dataType: "json",
            success: success
        });
    },
    removeFolder: function(folder, success){
        return $.ajax({
            url: '/folders/' + folder._id,
            type: "DELETE", 
            dataType: "json",
            success: success
        });
    },
    //////////////////////////////////////////FOLDERS//////////////////////////////////////


    //////////////////////////////////////////LISTBOARDS//////////////////////////////////////
    //Load
    loadListboards: function() {
        this.listboards = initialOptions.listboards;
        _.each(this.listboards, function (listboard) {            
           _.each(listboard.containers, function (container) {            
               container.items = [];
            });
        });
        this.selectFirstListboard();
    },


    //Gets
    getListboardById: function (listboardId) {
        return _.findWhere(this.listboards, {_id: listboardId});
    }, 
    getAllListboards: function() {
        return this.listboards;
    },
    getSelectedListboard: function() {
        return this.selectedListboard;
    },
    getSelectedListboardId: function() {
        return this.getSelectedListboard() && this.getSelectedListboard()._id;
    },


    //CRUD
    selectFirstListboard: function() {
        this.selectedListboard = this.listboards[0];
    },
    setSelectedListboard: function(listboardId) {
        this.selectedListboard = this.getListboardById(listboardId);
        this.callback('selected.listboard.changed');
    },
    addListboard: function(listboard) {
        _.each(listboard.containers, function (container) {            
           container.items = [];
        });
        this.listboards.push(listboard);
        this.callback('listboard.added');
    },
    updateListboard: function(listboardUpdate) {
        var listboard =  this.getListboardById(listboardUpdate._id);
        if (listboard) {
            _.extend(listboard, listboardUpdate);
            if(this.getSelectedListboardId() === listboardId)
                this.callback('selected.listboard.changed');
        }
    }, 
    removeListboard: function(listboardId) {  
        var listboard = this.getListboardById(listboardId);
        if(listboard){
            this.listboards = _.without(this.listboards, listboard);
            var selectedListboardId = this.getSelectedListboardId();
            if(selectedListboardId === listboardId)
                this.selectFirstListboard();
            this.callback('listboard.removed');
        }
    },


    //Server calls    
    saveListboard: function(listboard){
        return $.ajax({
            url: '/listboards',
            type: "POST", 
            data: JSON.stringify(listboard),
            dataType: "json"
        });
    },    
    updateListboard: function(listboard){
        return $.ajax({
            url: '/listboards/' + listboard._id,
            type: "PUT", 
            data: JSON.stringify(listboard),
            dataType: "json"
        });
    },
    removeListboard: function(listboard){
        return $.ajax({
            url: '/listboards/' + listboard._id,
            type: "DELETE", 
            dataType: "json"
        });
    },
    //////////////////////////////////////////LISTBOARDS//////////////////////////////////////


    //////////////////////////////////////////CONTAINERS//////////////////////////////////////
    //Gets
    getContainerById: function(containerId){
        for (var i = 0; i < this.listboards.length; i++) {
            var container = this.getContainerByIdAndListboard(this.listboards[i], containerId);
            if(container)
                return container;
        };
    },
    getContainerByIdAndListboard: function(listboard, containerId) {
        return _.findWhere(listboard.containers, {_id: containerId});
    },
    getContainerByFolderId: function(listboard, folderId) {
        return _.findWhere(listboard.containers, {folder: folderId});
    },


    //CRUD
    addContainer: function(listboardId, container) {        
        container.items = [];
        var listboard = this.getListboardById(listboardId);
        if (listboard) {
            if(!this.getContainerByIdAndListboard(listboard, container._id))
                listboard.containers.push(container);
            if(this.getSelectedListboardId() === listboardId)
                this.callback('selected.listboard.container.added');
        }
    },
    updateContainer: function(listboardId, containerUpdate) {
        var listboard = this.getListboardById(listboardId);
        if (listboard) {
            var container = this.getContainerByIdAndListboard(listboard, containerUpdate._id);
            if (container) {
                _.extend(container, containerUpdate);
                if(this.getSelectedListboardId() === listboardId)
                    this.callback('selected.listboard.container.changed');
            }
        }
    },
    removeContainer: function(listboardId, containerId) {
        var listboard = this.getListboardById(listboardId);
        if (listboard) {
            var container = this.getContainerByIdAndListboard(listboard, containerId);
            if (container)
                listboard.containers = _.without(listboard.containers, listboard);
            if(this.getSelectedListboardId() === listboard._id)
                this.callback('selected.listboard.container.removed');
        }        
    },

    //Server calls    
    saveContainer: function(listboardId, container){
        return $.ajax({
            url: '/listboards/' + listboardId + '/containers',
            type: "POST", 
            data: JSON.stringify(container),
            dataType: "json"
        });
    },    
    updateContainer: function(listboardId, container){
        return $.ajax({
            url: '/listboards/' + listboardId + '/containers/' + container._id,
            type: "PUT", 
            data: JSON.stringify(container),
            dataType: "json"
        });
    },
    removeContainer: function(listboardId, container){
        return $.ajax({
            url: '/listboards/' + listboardId + '/containers/' + container._id,
            type: "DELETE", 
            dataType: "json"
        });
    },
    //////////////////////////////////////////CONTAINERS//////////////////////////////////////


    //////////////////////////////////////////ITEMS//////////////////////////////////////
    //Load
    loadItems: function () {
        this.items = []; 
        _.each(initialOptions.items || [], function (item) {            
            this.addItem(item);
        }, this);
    },


    //Gets
    getItemById: function(itemId) {
        return _.findWhere(this.items, {_id: itemId});
    },


    //CRUD
    addItem: function (item) {
        this.items.push(item);
        _.each(item.folders, function (folderId) {            
            this.addItemToFolder(folderId, item);
        }, this);
        _.each(item.containers, function (containerId) {            
            this.addItemToContainer(containerId, item);
        }, this);

        //Updates selected listboard
        var selectedListboard = this.getSelectedListboard();
        if(selectedListboard){
            var result = _.filter(selectedListboard.containers, function(container){
                return _.contains(item.folders, container.folder) 
                || _.contains(item.containers, container._id) 
            });
            if(result.length > 0)
                this.callback('selected.listboard.changed');
        }

    },
    addItemToFolder: function(folderId, item) {
        var folder = this.getFolderById(folderId);
        var itemExist = _.findWhere(folder.items, {_id: item._id});
        if(!itemExist)
            folder.items.push(item);
    },
    addItemToContainer: function(containerId, item) {
        var container = this.getContainerById(containerId);        
        var itemExist = _.findWhere(container.items, {_id: item._id});        
        if(!itemExist)
            container.items.push(item);
    },
    updateItem: function(itemUpdate) {
        var item =  this.getItemById(itemUpdate._id);
        if (item){

            var toAddFoldersIds = _.difference(itemUpdate.folders, item.folders);
            var toAddContainersIds = _.difference(itemUpdate.containers, item.containers);
            var toRemoveFolderIds = _.difference(item.folders, itemUpdate.folders);
            var toRemoveContainersIds = _.difference(item.containers, itemUpdate.containers);
            
             _.each(toAddFoldersIds, function (folderId) {            
                this.addItemToFolder(folderId, item);
            }, this);
            _.each(toAddContainersIds, function (containerId) {            
                this.addItemToContainer(containerId, item);
            }, this);
             _.each(toRemoveFolderIds, function (folderId) {            
                this.removeItemFromFolder(folderId, item);
            }, this);
            _.each(toRemoveContainersIds, function (containerId) {            
                this.removeItemFromContainer(containerId, item);
            }, this);

            _.extend(item, itemUpdate);

            //Checks if we need to throw an event
            var selectedListboard = this.getSelectedListboard();
            if(selectedListboard){
                var result = _.filter(selectedListboard.containers, function(container){
                    return _.contains(toAddFoldersIds, container.folder) 
                    || _.contains(toAddContainersIds, container._id) 
                    || _.contains(toRemoveFolderIds, container.folder) 
                    || _.contains(toRemoveContainersIds, container._id) 
                });
                if(result.length > 0)
                    this.callback('selected.listboard.changed');
            }
                
        }
    }, 
    removeItem: function (itemId) {
        var item =  this.getItemById(itemId);
        if (item){        
            this.items = _.without(this.items, item);
            _.each(item.folders, function (folderId) {            
                this.removeItemFromFolder(folderId, item);
            }, this);
            _.each(item.containers, function (containerId) {            
                this.removeItemFromContainer(containerId, item);
            }, this);

            //Updates selected listboard
            if(selectedListboard){
                var result = _.filter(selectedListboard.containers, function(container){
                    return _.contains(item.folders, container.folder) 
                    || _.contains(item.containers, container._id) 
                });
                if(result.length > 0)
                    this.callback('selected.listboard.changed');
            }
        }
    },
    removeItemFromFolder: function(folderId, itemToRemove) {
        var folder = this.getFolderById(folderId);
        var item = _.findWhere(folder.items, {_id: itemToRemove._id});
        if(item)
            folder.items = _.without(folder.items, item);
    },
    removeItemFromContainer: function(containerId, itemToRemove) {
        var container = this.getContainerById(containerId);
        var item = _.findWhere(container.items, {_id: itemToRemove._id});
        if(item)
            container.items = _.without(container.items, item);
    },


    //Server calls    
    saveItem: function(item){
        return $.ajax({
            url: '/items',
            type: "POST", 
            data: JSON.stringify(item),
            dataType: "json"
        });
    },    
    updateItem: function(item){
        return $.ajax({
            url: '/items/' + item._id,
            type: "PUT", 
            data: JSON.stringify(item),
            dataType: "json"
        });
    },
    removeItem: function(item){
        return $.ajax({
            url: '/items/' + item._id,
            type: "DELETE", 
            dataType: "json"
        });
    },
    //////////////////////////////////////////ITEMS//////////////////////////////////////

    //////////////////////////////////////////EXTENSION//////////////////////////////////////
    isExtensionInstalled: function(callback) {      
        //window.chrome.app.isInstalled does not work for extensions
        //Only way I found is this
        var self = this;
        if(!this.extensionInstalled) {
            var s = document.createElement('script');
            s.onload = function() {
                self.extensionInstalled = true;
                callback(true);
            };
            s.onerror = function() {
                self.extensionInstalled = true;
                callback(false);
            };
            s.src = 'chrome-extension://jhlmlfahjekacljfabgbcoanjooeccmm/manifest.json';
            document.body.appendChild(s);
        }
    },
    installChromeExtension: function() {        
        var self = this;
        if (typeof window.chrome !== "undefined"){
            window.chrome.webstore.install(
                'https://chrome.google.com/webstore/detail/jhlmlfahjekacljfabgbcoanjooeccmm',
                function(){                    
                    self.callback('extension.possible.installed');
                    $('#installExtensionModal').modal('hide');
                },
                function(){
                    //TODO: manage when it fails
                }
            );
            
        }
    }
    //////////////////////////////////////////EXTENSION//////////////////////////////////////

    
};

module.exports = State;

