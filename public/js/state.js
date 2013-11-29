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

var typeObject = require('./data/typeobject'),
    TypeObject = typeObject.TypeObject;

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
    .attr('onePanel', { default: true })
    .attr('panel1SelectedTypeObject', { model: TypeObject })
    .attr('panel2SelectedTypeObject', { model: TypeObject })
    .attr('selection', { model: Selection })
    .use(model.nestedObjects);

_.extend(State1.prototype, {

    loadInitialData: function (initialOptions) {

        //Load items
        this.loadItems(initialOptions.items || []);

        //Loads Folders
        this.loadFolders(initialOptions.folders || []);

        //Loads Listboards
        this.loadListboards(initialOptions.listboards || []);
        
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

    //Gets
    getFolderByFilter: function (filter) {
        return this.folders.byFilter(filter);
    },
    getFolderById: function (folderId) {
        return this.folders.byId(folderId);
    },
    getFoldersByIds: function(folderIds) {
        var self = this;
        return _.map(folderIds, function(folderId) {
            return self.getFolderById(folderId);
        })
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
        folder.children = new Array();

        this.folders.push(folder);

        if (!folder.isRoot) {                        
            var parentFolder = this.getFolderByFilter(folder.path);            
            parentFolder.children.push(folder._id); 
            //TODO: we need a .update() method in moco to force an update            
            parentFolder.children = (new Array()).concat(parentFolder.children);
        }

        return folder;
    },
    updateFolder: function (folderUpdate) {
        var folder = this.getFolderById(folderUpdate._id);
        if (folder)
            _.extend(folder, folderUpdate);
    },
    removeFolder: function (folderId) {
        var folder = this.folders.removeById(folderId);
        if (folder) {
            if(!folder.isRoot) {
                var parent = this.getFolderByFilter(folder.path);
                var index = parent.children.indexOf(folderId);
                if (index > -1)
                    parent.children.splice(index, 1);                
            }
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
        if (listboard) //We do not update arrays here            
            _.extend(listboard, _.pick(listboardUpdate, 'label'));
    },
    removeListboard: function (listboardDeleteId) {
        var listboard = this.listboards.removeById(listboardDeleteId);
        if (listboard) {
            // remove state-wise containers collection
            listboard.containers.forEach(function(container) {
                this.containers.removeById(container._id); // O(N)
            }, this);
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
            var listboard = this.getListboardById(listboardId);
            listboard.containers.removeById(containerId);
        }
    },

    //Server calls    
    serverSaveContainer: function (container, success) {
        return $.ajax({
            url: '/listboards/' + container.listboardId + '/containers',
            type: "POST",
            data: JSON.stringify(container),
            success: success
        });
    },
    serverUpdateContainer: function (container, success) {        
        return $.ajax({
            url: '/listboards/' + container.listboardId + '/containers/' + container._id,
            type: "PUT",
            data: JSON.stringify(container),
            success: success
        });
    },
    serverRemoveContainer: function (container, success) {
        return $.ajax({
            url: '/listboards/' + container.listboardId + '/containers/' + container._id,
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
    getItemsByIds: function(itemIds) {
        var self = this;
        return _.map(itemIds, function(itemId) {
            return self.getItemById(itemId);
        })
    },

    //CRUD
    addItem: function (item) {
        item = new Item(item);// to have common reference
        this.items.push(item);
    },
    updateItem: function (itemUpdate) {
        var item = this.getItemById(itemUpdate._id);
        if (item)
            _.extend(item, itemUpdate);
    },
    removeItem: function (itemId) {
        this.items.removeById(itemId);
    },


    //Server calls    
    serverSaveItemToContainer: function (listboardId, containerId, item, success) {
        return $.ajax({
            url: '/listboards/' + listboardId + '/containers/' + containerId + '/items',
            type: "POST",
            data: JSON.stringify(item),
            success: success
        });
    },
    serverSaveItemToFolder: function (folderId, item, success) {
        return $.ajax({
            url: '/folders/' + folderId + '/items',
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
    serverRemoveItemFromContainer: function (listboardId, containerId, item, success) {
        return $.ajax({
            url: '/listboards/' + listboardId + '/containers/' + containerId + '/items/' + item._id,
            type: "DELETE",
            success: success
        });
    },
    serverRemoveItemFromFolder: function (folderId, item, success) {
        return $.ajax({
            url: '/folders/' + folderId + '/items/' + item._id,
            type: "DELETE",
            success: success
        });
    },
    //////////////////////////////////////////ITEMS//////////////////////////////////////

    
    //////////////////////////////////////////PANELS//////////////////////////////////////

    // selected listboard
    getPanel1SelectedTypeObject: function () {
        return (this.panel1SelectedTypeObject && this.panel1SelectedTypeObject.type? this.panel1SelectedTypeObject : null);
    },
    getPanel2SelectedTypeObject: function () {
        return (this.panel2SelectedTypeObject && this.panel2SelectedTypeObject.type? this.panel2SelectedTypeObject : null);
    },   
    setObjectToTypeObject: function(typeobject, object) {
         switch(typeobject.type){
            case 'listboard' : typeobject.listboard = object; break;
            case 'container' : typeobject.container = object; break;
            case 'item' : typeobject.item = object; break;
            case 'folder' : typeobject.folder = object; break;
        }
    },
    setPanel1SelectedTypeObject: function (type, object) {       
        var typeobject = {type: type};
        this.setObjectToTypeObject(typeobject, object);
        this.panel1SelectedTypeObject = new TypeObject(typeobject);
    },
    setPanel2SelectedTypeObject: function (type, object) {
        var typeobject = {type: type};
        this.setObjectToTypeObject(typeobject, object);
        this.panel2SelectedTypeObject = new TypeObject(typeobject);        
    },
    hasPanel1SelectedTypeObject: function(type, id) { 
        return  this.panel1SelectedTypeObject &&
                this.panel1SelectedTypeObject.type === type &&
                this.panel1SelectedTypeObject.getObjectId() === id;
    },
    hasPanel2SelectedTypeObject: function(type, id) {
        return  this.panel2SelectedTypeObject &&
                this.panel2SelectedTypeObject.type === type &&
                this.panel2SelectedTypeObject.getObjectId() === id;
    },

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

