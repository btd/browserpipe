var $ = require('jquery'),
    _ = require('lodash');

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
    .attr('laterListboard')
    .attr('archiveListboard')
    .attr('browserListboards')
    .attr('items', { collection: Items })
    .attr('selected1')
    .attr('selected2')
    .attr('activePanel', { default: 1 })
    .use(model.nestedObjects);

_.extend(State1.prototype, {

    loadInitialData: function (initialOptions) {

        //Load items
        this.loadItems(initialOptions.items || []);

        this.laterListboard = initialOptions.user.laterListboard;
        this.browserListboards = initialOptions.user.browserListboards;
        this.archiveListboard = initialOptions.user.archiveListboard;
        
        //Init selection
        //this.clearSelection();
    },

    getLaterListboard: function () {
        return this.laterListboard;
    },
    getAllBrowserListboards: function () {
        return this.browserListboards;
    },

    setSelected: function(num, obj) {
        this['selected'+num] = obj;
    },

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
        return _.map(itemIds, this.getItemById, this);
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

    serverAddItemToItem: function (parentId, item, success) {
        $.ajax({
            url: '/items/' + parentId + '/items',
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

    serverDeleteItem: function(item, success) {
        return $.ajax({
            url: '/items/' + item._id,
            type: "DELETE",
            success: success
        });
    },

    //////////////////////////////////////////ITEMS//////////////////////////////////////

    
    //////////////////////////////////////////PANELS//////////////////////////////////////
    /*
    // selected listboard
    getActivePanelSelectedTypeObject: function() {
        if(this.isPanel1Active)
            return this.getPanel1SelectedTypeObject();
        else
            return this.getPanel2SelectedTypeObject();
    },
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
            case 'search' : typeobject.search = object; break;
            case 'selection' : typeobject.selection = selection; break;
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
    */
    //////////////////////////////////////////PANELS//////////////////////////////////////



    //////////////////////////////////////////SELECTION//////////////////////////////////////

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
        //this.clearContainerSelection();
        this.clearItemSelection();
        //this.clearFolderSelection();
    },
    clearListboardSelection: function() {    
        this.selection.listboards.clear();
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
    },

    //////////////////////////////////////////SELECTION//////////////////////////////////////


    ///////////////////////////////////////////SEARCH///////////////////////////////////////
    
    searchItem: function (query, success) {
        return $.ajax({
            url: '/search/' + query,
            type: "GET",
            success: success
        });
    },

    ///////////////////////////////////////////SEARCH///////////////////////////////////////


});

module.exports = new State1();

