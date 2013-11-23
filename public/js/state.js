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

var typeId = require('./data/typeid'),
    TypeId = typeId.TypeId;

var selection = require('./data/selection'),
    Selection = selection.Selection;

$.ajaxSetup({
    dataType: 'json',
    contentType: 'application/json'
});

var model = require('moco').model;

var State1 = model()
    .attr('folders', { collection: Folders })
    .attr('listboards', { collection: Listboards })
    .attr('containers', { collection: Containers })
    .attr('items', { collection: Items })
    .attr('panel1SelectedTypeId', { model: TypeId })
    .attr('panel2SelectedTypeId', { model: TypeId })
    .attr('selection', { model: Selection })
    .use(model.nestedObjects);

_.extend(State1.prototype, {

    loadInitialData: function (initialOptions) {

        //Loads Folders
        this.loadFolders(initialOptions.folders || []);

        //Loads Listboards
        this.loadListboards(initialOptions.listboards || []);

        //Load items
        this.loadItems(initialOptions.items || []);

        //Init selection
        this.clearSelection();
    },


    //////////////////////////////////////////FOLDERS//////////////////////////////////////
    //Load
    loadFolders: function (from) {
        //Load children folders
        _.each(from, function(folderObj) {
            var folder = this.addFolder(folderObj);
            if(folder.isRoot)
                this.selectedFolder = folder;
        }, this);
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
    getRootFolder: function () {
        //There is always a root folder
        return this.folders[0];
    },

    //CRUD
    addFolder: function (folderObj) {
        var folder = new Folder(folderObj);

        this.folders.push(folder);

        if (!folder.isRoot) {                        
            var parentFolder = this.getFolderByFilter(folder.path);
            parentFolder.children.push(folder);                     
        }

        return folder;
    },
    updateFolder: function (folderUpdate) {
        var folder = this.getFolderById(folderUpdate._id);
        if (folder) {
            _.extend(folder, folderUpdate);
        }
    },
    removeFolder: function (folderDelete) {
        var folder = this.folders.removeById(folderDelete._id);
        if (folder) {
            if(!folder.isRoot) {
                var parent = this.getFolderByFilter(folder.path);
                parent.children.removeById(folderDelete._id);
            }

            //if we remove it from a panel, we unset it
            if(this.hasPanel1SelectedTypeId('folder', folder._id))
                this.unSetPanel1SelectedTypeId();
            if(this.hasPanel2SelectedTypeId('folder', folder._id))
                this.unSetPanel2SelectedTypeId();
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
        _.each(from, this.addListboard, this);
    },


    //Gets
    getListboardById: function (listboardId) {
        return this.listboards.byId(listboardId);
    },
    getAllListboards: function () {
        return this.listboards;
    },
    getFirstListboard: function () {
        return (this.listboards.length > 0? this.listboards[0] : null);
    },

    //CRUD Listboard
    addListboard: function (listboard) {
        //it is moveton to change object that someone give us
        var listboardCopy = _.omit(listboard, 'containers');        
        this.listboards.push(listboardCopy);

        _.each(listboard.containers, function(container) {
            this.addContainer(listboard._id, container);            
        }, this);
    },
    updateListboard: function (listboardUpdate) {
        var listboard = this.getListboardById(listboardUpdate._id);
        if (listboard) {
            //We do not update arrays here
            _.extend(listboard, _.pick(listboardUpdate, 'label'));
        }
    },
    removeListboard: function (listboardDelete) {
        var listboard = this.listboards.removeById(listboardDelete._id);
        if (listboard) {
            // remove state-wise containers collection
            listboard.containers.forEach(function(container) {
                this.containers.removeById(container._id); // O(N)
            }, this);

            //if we remove it from a panel, we unset it
            if(this.hasPanel1SelectedTypeId('listboard', listboard._id))
                this.unSetPanel1SelectedTypeId();
            if(this.hasPanel2SelectedTypeId('listboard', listboard._id))
                this.unSetPanel2SelectedTypeId();
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

    //CRUD
    addContainer: function (listboardId, container) {
        var listboard = this.getListboardById(listboardId);
        if (listboard) {
            container.listboardId = listboardId;
            container = new Container(container); // this is required to have the same reference in both collections
            listboard.containers.push(container);
            this.containers.push(container);
        }
    },

    updateContainer: function (listboardId, containerUpdate) {
        var listboard = this.getListboardById(listboardId);
        if (listboard) {
            var container = listboard.containers.byId(containerUpdate._id);
            if (container)
                _.extend(container, containerUpdate);
        }
    },
    removeContainer: function (listboardId, containerId) {
        var container = this.containers.removeById(containerId);
        if (container) {
            this.getListboardById(listboardId).containers.removeById(containerId);

            //if we remove it from a panel, we unset it
            if(this.hasPanel1SelectedTypeId('container', container._id))
                this.unSetPanel1SelectedTypeId();
            if(this.hasPanel2SelectedTypeId('container', container._id))
                this.unSetPanel2SelectedTypeId();
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
        _.each(from, this.addItem, this);
    },


    //Gets
    getItemById: function (itemId) {
        return this.items.byId(itemId);
    },

    //CRUD
    
    addItem: function (item) {
        item = new Item(item);// to have common reference
        this.items.push(item);
        _.each(item.folders, function (folderId) {
            this.addItemToFolder(folderId, item);
        }, this);
        _.each(item.containers, function (containerId) {
            this.addItemToContainer(containerId, item);
        }, this);

        //Updates selected listboard
        // we make updates in methods that was called upper

    },
    addItemToFolder: function (folderId, item) {
        var folder = this.getFolderById(folderId);
        var itemExist = folder.items.byId(item._id);
        if (!itemExist) {
            folder.items.push(item);
        }
    },
    addItemToContainer: function (containerId, item) {
        var container = this.getContainerById(containerId);
        if (container) {
            var itemExist = container.items.byId(item._id);
            if (!itemExist) {
                container.items.push(item);
            }
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
        }
    },
    removeItem: function (itemId) {
        var item = this.items.removeById(itemId);
        if (item) {
            _.each(item.folders, function (folderId) {
                this.removeItemFromFolder(folderId, item);
            }, this);
            _.each(item.containers, function (containerId) {
                this.removeItemFromContainer(containerId, item);
            }, this);

            //if we remove it from a panel, we unset it
            if(this.hasPanel1SelectedTypeId('item', item._id))
                this.unSetPanel1SelectedTypeId();
            if(this.hasPanel2SelectedTypeId('item', item._id))
                this.unSetPanel2SelectedTypeId();
        }
    },
    removeItemFromFolder: function (folderId, itemToRemove) {
        var folder = this.getFolderById(folderId);
        var itemExist = folder.items.removeById(item._id);
    },
    removeItemFromContainer: function (containerId, itemToRemove) {
        var container = this.getContainerById(containerId);
        if (container) {
            var itemExist = container.items.removeById(item._id);
        }
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

    
    //////////////////////////////////////////PANELS//////////////////////////////////////

    // selected listboard
    getPanel1SelectedTypeId: function () {
        return this.panel1SelectedTypeId;
    },
    getPanel2SelectedTypeId: function () {
        return this.panel2SelectedTypeId;
    },    
    setPanel1SelectedTypeId: function (type, id) {
        this.panel1SelectedTypeId = new TypeId({type: type, _id: id});
    },
    setPanel2SelectedTypeId: function (type, id) {
        this.panel2SelectedTypeId = new TypeId({type: type, _id: id});
    },
    unSetPanel1SelectedTypeId: function() {
        this.panel1SelectedTypeId = null;  
    },
    unSetPanel2SelectedTypeId: function() {
        this.panel1SelectedTypeId = null;  
    },
    hasPanel1SelectedTypeId: function(type, id) {
        return this.panel1SelectedTypeId.type === type && this.panel1SelectedTypeId._id === id;
    },
    hasPanel2SelectedTypeId: function(type, id) {
        return this.panel2SelectedTypeId.type === type && this.panel2SelectedTypeId._id === id;
    }

    //////////////////////////////////////////PANELS//////////////////////////////////////



    //////////////////////////////////////////SELECTED OBJECTSSELECTION//////////////////////////////////////

    getSelection: function() {
        return this.selection;
    },
    getSelectedListboards: function() {
        return this.selection.listboards;
    },    
    getSelectedContainers: function() {
        return this.selection.containers;
    },    
    getSelectedItems: function() {
        return this.selection.items;
    },    
    getSelectedFolders: function() {
        return this.selection.folders;
    },    
    getSelectedListboardById: function(listboardId) {
        return this.selection.listboards.byId(listboardId);
    },
    getSelectedContainerById: function(containerId) {
        return this.selection.containers.byId(containerId);
    },
    getSelectedItemById: function(itemId) {
        return this.selection.items.byId(itemId);
    },
    getSelectedFolderById: function(folderId) {
        return this.selection.folders.byId(folderId);
    },
    clearSelection: function() {    
        this.clearListboardSelection();
        this.clearContainerSelection();
        this.clearItemSelection();
        this.clearFolderSelection();               
    },
    clearListboardSelection: function() {    
        this.selection.listboards.clear();
    },
    clearContainerSelection: function() {    
        this.selection.containers.clear();
    },
    clearItemSelection: function() {    
        this.selection.items.clear();
    },
    clearFolderSelection: function() {    
        this.selection.folders.clear();
    },
    addListboardToSelection: function(listboard) {           
        this.selection.listboards.push(listboard);     
    },
    removeListboardFromSelection: function(listboardId) {        
        this.selection.listboards.removeById(listboardId);
    },
    addContainerToSelection: function(container) {            
        this.selection.containers.push(container);     
    },
    removeContainerFromSelection: function(containerId) {        
        this.selection.containers.removeById(containerId);
    },
    addItemToSelection: function(item) {            
        this.selection.items.push(item);     
    },
    removeItemFromSelection: function(itemId) {        
        this.selection.items.removeById(itemId);
    },
    addFolderToSelection: function(folder) {        
        this.selection.folders.push(folder);  
    },
    removeFolderFromSelection: function(folderId) {        
        this.selection.folders.removeById(folderId);
    }

    //////////////////////////////////////////SELECTION//////////////////////////////////////


});

module.exports = new State1();

