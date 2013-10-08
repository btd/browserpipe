var $ = require('jquery'),
    _ = require('lodash');

var folder = require('./data/folder'),
    Folder = folder.Folder,
    Folders = folder.Folders;

var listboard = require('./data/listboard'),
    Listboard = listboard.Listboard,
    Listboards = listboard.Listboards,
    Container = listboard.Container,
    Containers = listboard.Containers;

var item = require('./data/item'),
    Item = item.Item,
    Items = item.Items;

//TODO mix to State emitter
//TODO wrap triggering events to subscribed on change of collections and models
var State = {
    init: function (options) {
        this.trigger = options.callback;

        $.ajaxSetup({
            dataType: 'json',
            contentType: 'application/json'
        })
    },
    loadInitialData: function (initialOptions) {

        //Loads Folders
        this.loadFolders(initialOptions.folders || []);

        //Loads Listboards
        this.loadListboards(initialOptions.listboards || []);

        //Load items
        this.loadItems(initialOptions.items || []);
    },


    //////////////////////////////////////////FOLDERS//////////////////////////////////////
    //Load
    loadFolders: function (from) {
        //Load children folders
        this.folders = new Folders([]);
        _.each(from, this.addFolder, this);
    },

    getFolderByFilter: function (filter) {
        return this.folders.byFilter(filter);
    },
    getFolderById: function (folderId) {
        return this.folders.byId(folderId);
    },
    getAllFolders: function () {
        return this.folders;
    },

    //CRUD
    addFolder: function (folder) {
        folder = new Folder(folder);

        this.folders.push(folder);

        if (!folder.isRoot) {

            var parentFolder = this.folders.byFilter(folder.path);
            parentFolder.children.push(folder);

            if (this.getSelectedListboard() && this.getContainerByFolderId(folder._id))
                this.trigger('selected.listboard.folder.added');
        }
    },
    updateFolder: function (folderUpdate) {
        var folder = this.getFolderById(folderUpdate._id);
        if (folder) {
            _.extend(folder, folderUpdate);

            if (this.getSelectedListboard() && this.getContainerByFolderId(folder._id))
                this.trigger('selected.listboard.folder.changed');
        }
    },
    removeFolder: function (folderDelete) {
        var folder = this.folders.removeById(folderDelete._id);
        if (folder) {
            if(!folder.isRoot) {
                var parent = this.getFolderByFilter(folder.path);
                parent.children.removeById(folderDelete._id);
            }

            if (this.getSelectedListboard() && this.getContainerByFolderId(parent._id))
                this.trigger('selected.listboard.folder.removed');
        }
    },

    //TODO it should be done in more universal way, also need more universal validation
    //Server calls    
    serverSaveFolder: function (folder, success) {
        return $.ajax({
            url: '/folders',
            type: 'POST',
            data: JSON.stringify(folder),
            success: success
        });
    },
    serverUpdateFolder: function (folder, success) {
        return $.ajax({
            url: '/folders/' + folder._id,
            type: "PUT",
            data: JSON.stringify(folder),
            success: success
        });
    },
    serverRemoveFolder: function (folder, success) {
        return $.ajax({
            url: '/folders/' + folder._id,
            type: "DELETE",
            success: success
        });
    },
    //////////////////////////////////////////FOLDERS//////////////////////////////////////


    //////////////////////////////////////////LISTBOARDS//////////////////////////////////////
    //Load
    loadListboards: function (from) {
        this.listboards = new Listboards();
        this.containers = new Containers(); //i hope i am right that embedded documents will have unique id

        _.each(from, this.addListboard, this);
    },


    //Gets
    getListboardById: function (listboardId) {
        return this.listboards.byId(listboardId);
    },
    getAllListboards: function () {
        return this.listboards;
    },

    // selected listboard
    getSelectedListboard: function () {
        return this.selectedListboard;
    },
    getSelectedListboardId: function () {
        return this.getSelectedListboard() && this.getSelectedListboard()._id;
    },
    selectFirstListboard: function () {
        this.setSelectedListboard(this.listboards[0]._id);
    },
    setSelectedListboard: function (listboardId) {
        this.selectedListboard = this.getListboardById(listboardId);
        this.trigger('selected.listboard.changed');
    },

    //CRUD Listboard
    addListboard: function (listboard) {
        //it is moveton to change object that someone give us
        var listboardCopy = _.omit(listboard, 'containers');
        this.listboards.push(listboardCopy);

        _.each(listboard.containers, function(container) {
            this.addContainer(listboard._id, container);
        }, this);

        this.trigger('listboard.added');
    },
    updateListboard: function (listboardUpdate) {
        var listboard = this.getListboardById(listboardUpdate._id);
        if (listboard) {
            //We do not update arrays here
            _.extend(listboard, _.pick(listboardUpdate, 'label'));
            if (this.getSelectedListboardId() === listboard._id)
                this.trigger('selected.listboard.changed');
        }
    },
    removeListboard: function (listboardDelete) {
        var listboard = this.listboards.removeById(listboardDelete._id);
        if (listboard) {
            // remove state-wise containers collection
            listboard.containers.each(function(container) {
                this.containers.removeById(container._id); // O(N)
            }, this);

            //if we remove selected listboard set new selected
            var selectedListboardId = this.getSelectedListboardId();
            if (selectedListboardId === listboard._id)
                this.selectFirstListboard();

            //TODO in trigger we can add small delay to combine several events and push them together
            this.trigger('listboard.removed');
        }
    },


    //Server calls    
    serverSaveListboard: function (listboard, success) {
        return $.ajax({
            url: '/listboards',
            type: "POST",
            data: JSON.stringify(listboard),
            success: success
        });
    },
    serverUpdateListboard: function (listboard, success) {
        return $.ajax({
            url: '/listboards/' + listboard._id,
            type: "PUT",
            data: JSON.stringify(listboard),
            success: success
        });
    },
    serverRemoveListboard: function (listboard, success) {
        return $.ajax({
            url: '/listboards/' + listboard._id,
            type: "DELETE",
            success: success
        });
    },
    //////////////////////////////////////////LISTBOARDS//////////////////////////////////////


    //////////////////////////////////////////CONTAINERS//////////////////////////////////////
    //Gets
    getContainerById: function (containerId) {
        return this.containers.byId(containerId);
    },
    getContainerByIdAndListboard: function (listboard, containerId) {
        return listboard.containers.byId(containerId);
    },
    // it can be several containers
    getContainerByFolderId: function (folderId) {
        return this.containers.filter(function(container) {
            return container.folder && container.folder._id === folderId;
        });
    },


    //CRUD
    addContainer: function (listboardId, container) {
        var listboard = this.getListboardById(listboardId);
        if (listboard) {
            if (container.type === 2) {
                container = _.clone(container); // to do not modify original object
                container.folder = this.getFolderById(container.folder);
            }
            container = new Container(container); // this is required to have the same reference in both collections
            listboard.containers.push(container);
            this.containers.push(container);

            if (this.getSelectedListboardId() === listboardId)
                this.trigger('selected.listboard.container.added');
        }
    },

    updateContainer: function (listboardId, containerUpdate) {
        var listboard = this.getListboardById(listboardId);
        if (listboard) {
            var container = listboard.containers.byId(containerUpdate._id);
            if (container) {
                //If folder changed, we load again the folder obj
                if (container.type === 2 && container.folder._id !== containerUpdate.folder) {
                    containerUpdate = _.clone(containerUpdate);
                    containerUpdate.folder = this.getFolderById(containerUpdate.folder);
                }
                //We then mixed the props
                _.extend(container, containerUpdate);
                if (this.getSelectedListboardId() === listboardId)
                    this.trigger('selected.listboard.container.changed');
            }
        }
    },
    removeContainer: function (listboardId, containerId) {
        var container = this.containers.removeById(containerId);
        if (container) {
            this.getListboardById(listboardId).containers.removeById(containerId);

            if (this.getSelectedListboardId() === listboardId)
                this.trigger('selected.listboard.container.removed');
        }
    },

    //Server calls    
    serverSaveContainer: function (listboardId, container, success) {
        return $.ajax({
            url: '/listboards/' + listboardId + '/containers',
            type: "POST",
            data: JSON.stringify(container),
            success: success
        });
    },
    serverUpdateContainer: function (listboardId, container, success) {
        return $.ajax({
            url: '/listboards/' + listboardId + '/containers/' + container._id,
            type: "PUT",
            data: JSON.stringify(container),
            success: success
        });
    },
    serverRemoveContainer: function (listboardId, container, success) {
        return $.ajax({
            url: '/listboards/' + listboardId + '/containers/' + container._id,
            type: "DELETE",
            success: success
        });
    },
    //////////////////////////////////////////CONTAINERS//////////////////////////////////////


    //////////////////////////////////////////ITEMS//////////////////////////////////////
    //Load
    loadItems: function (from) {
        this.items = new Items();
        _.each(from, this.addItem, this);
    },


    //Gets
    getItemById: function (itemId) {
        return this.items.byId(itemId);
    },
    getSelectedItem: function () {
        return this.selectedItem;
    },
    getSelectedItemId: function () {
        return this.getSelectedItem() && this.getSelectedItem()._id;
    },


    //CRUD
    setSelectedItem: function (itemId) {
        this.selectedItem = this.getItemById(itemId);
    },
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
        if (selectedListboard) {
            var result = _.filter(selectedListboard.containers, function (container) {
                return _.contains(item.folders, container.folder) || _.contains(item.containers, container._id)
            });
            if (result.length > 0)
                this.trigger('selected.listboard.changed');
        }

    },
    addItemToFolder: function (folderId, item) {
        var folder = this.getFolderById(folderId);
        var itemExist = _.findWhere(folder.items, {_id: item._id});
        if (!itemExist)
            folder.items.push(item);
        //Checks if the folder is in the selected listboard
        var containers = _.compact(this.getContainerByFolderId(folderId));
        var selectedListboard = this.getSelectedListboard();

        if (selectedListboard)
            for (var index in containers) {
                if (this.getContainerByIdAndListboard(selectedListboard, containers[index]._id)) {
                    this.trigger('selected.listboard.changed');
                    return;
                }
            }


    },
    addItemToContainer: function (containerId, item) {
        var container = this.getContainerById(containerId);
        if (container) {
            var itemExist = _.findWhere(container.items, {_id: item._id});
            if (!itemExist)
                container.items.push(item);
            var selectedListboard = this.getSelectedListboard();
            if (selectedListboard && this.getContainerByIdAndListboard(selectedListboard, containerId))
                this.trigger('selected.listboard.changed');
        }
    },
    updateItem: function (itemUpdate) {
        var item = this.getItemById(itemUpdate._id);
        if (item) {

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
            if (selectedListboard) {
                var result = _.filter(selectedListboard.containers, function (container) {
                    return _.contains(toAddFoldersIds, container.folder) ||
                        _.contains(toAddContainersIds, container._id) ||
                        _.contains(toRemoveFolderIds, container.folder) ||
                        _.contains(toRemoveContainersIds, container._id)
                });
                if (result.length > 0)
                    this.trigger('selected.listboard.changed');
            }

            if (this.getSelectedItemId() === item._id)
                this.trigger('selected.item.changed');
        }
    },
    removeItem: function (itemId) {
        var item = this.getItemById(itemId);
        if (item) {
            this.items = _.without(this.items, item);
            _.each(item.folders, function (folderId) {
                this.removeItemFromFolder(folderId, item);
            }, this);
            _.each(item.containers, function (containerId) {
                this.removeItemFromContainer(containerId, item);
            }, this);

            //Updates selected listboard
            if (selectedListboard) {
                var result = _.filter(selectedListboard.containers, function (container) {
                    return _.contains(item.folders, container.folder) || _.contains(item.containers, container._id)
                });
                if (result.length > 0)
                    this.trigger('selected.listboard.changed');
            }
        }
    },
    removeItemFromFolder: function (folderId, itemToRemove) {
        var folder = this.getFolderById(folderId);
        var item = _.findWhere(folder.items, {_id: itemToRemove._id});
        if (item)
            folder.items = _.without(folder.items, item);
    },
    removeItemFromContainer: function (containerId, itemToRemove) {
        var container = this.getContainerById(containerId);
        var item = _.findWhere(container.items, {_id: itemToRemove._id});
        if (item)
            container.items = _.without(container.items, item);
    },


    //Server calls    
    serverSaveItem: function (item, success) {
        return $.ajax({
            url: '/items',
            type: "POST",
            data: JSON.stringify(item),
            success: success
        });
    },
    serverUpdateItem: function (item, success) {
        return $.ajax({
            url: '/items/' + item._id,
            type: "PUT",
            data: JSON.stringify(item),
            success: success
        });
    },
    serverRemoveItem: function (item, success) {
        return $.ajax({
            url: '/items/' + item._id,
            type: "DELETE",
            success: success
        });
    },
    //////////////////////////////////////////ITEMS//////////////////////////////////////

    //////////////////////////////////////////EXTENSION//////////////////////////////////////
    isExtensionInstalled: function (callback) {
        //window.chrome.app.isInstalled does not work for extensions
        //Only way I found is this
        var self = this;
        if (!this.extensionInstalled) {
            var s = document.createElement('script');
            s.onload = function () {
                self.extensionInstalled = true;
                callback(true);
            };
            s.onerror = function () {
                self.extensionInstalled = true;
                callback(false);
            };
            s.src = 'chrome-extension://jhlmlfahjekacljfabgbcoanjooeccmm/manifest.json';
            document.body.appendChild(s);
        }
    },
    installChromeExtension: function () {
        var self = this;
        if (typeof window.chrome !== "undefined") {
            window.chrome.webstore.install(
                'https://chrome.google.com/webstore/detail/jhlmlfahjekacljfabgbcoanjooeccmm',
                function () {
                    self.callback('extension.possible.installed');
                    $('#installExtensionModal').modal('hide');
                },
                function () {
                    //TODO: manage when it fails
                }
            );

        }
    }
    //////////////////////////////////////////EXTENSION//////////////////////////////////////


};

module.exports = State;

