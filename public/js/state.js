var $ = require('jquery');

var item = require('./data/item'),
    Item = item.Item,
    Items = item.Items;

$.ajaxSetup({
    dataType: 'json',
    contentType: 'application/json'
});

var model = require('moco').model;

var State1 = model()
    .attr('browser')
    .attr('archive')
    .attr('items', { collection: Items })
    .attr('selectedItem')
    .attr('selectedFolder')
    .attr('sidebarTab')
    .attr('sidebarCollapsed')
    .use(model.nestedObjects);

var proto = {

    loadInitialData: function (initialOptions) {

        //Load items
        this.loadItems(initialOptions.items || []);

        this.browser = this.getItemById(initialOptions.user.browser);
        this.archive = this.getItemById(initialOptions.user.archive);

        this.sidebarCollapsed = true;
    },

    //////////////////////////////////////////ITEMS//////////////////////////////////////
    //Load
    loadItems: function (from) {
        from.forEach(this.addItem, this);
    },


    //Gets
    getItemById: function (itemId) {
        return this.items.byId(itemId);
    },
    getItemsByIds: function(itemIds) {
        return itemIds.map(this.getItemById, this);
    },

    //CRUD
    addItem: function (item) {
        item = new Item(item);// to have common reference
        this.items.push(item);
    },
    updateItem: function (itemUpdate) {
        var item = this.getItemById(itemUpdate._id);
        if (item) {
            for(var p in itemUpdate) {
                item[p] = itemUpdate[p];
            }
        }
    },
    removeItem: function (itemId) {
        this.items.removeById(itemId);
    },
    serverAddItemToBrowser: function (parentId, item, success) {
	      item.browserParent = parentId;
        $.ajax({
            url: '/browser/items/' + parentId,
            type: "POST",
            data: JSON.stringify(item),
            success: success
        });
    },
    serverAddItemToArchive: function (parentId, item, success) {
	      item.archiveParent = parentId;
        $.ajax({
            url: '/archive/items/' + parentId,
            type: "POST",
            data: JSON.stringify(item),
            success: success
        });
    },
    moveItemToBrowser: function(itemId, isPrevious, isNext, success) {
        var data = {};
        if(isPrevious) data.isPrevious = true;
        else if(isNext) data.isNext = true;
        return $.ajax({
            url: '/browser/items/' + itemId,
            type: "PUT",
            data: JSON.stringify(data),
            success: success
        });
    },
    moveItemToArchive: function(itemId, parentId, success) {
        return $.ajax({
            url: '/archive/items/' + itemId,
            type: "PUT",
            data: JSON.stringify({ parent: parentId }),
            success: success
        });
    },
    removeItemFromBrowser: function(item, success) {
        return $.ajax({
            url: '/browser/items/' + item._id,
            type: "DELETE",
            success: success
        });
    },
    removeItemFromArchive: function(item, success) {
        return $.ajax({
            url: '/archive/items/' + item._id,
            type: "DELETE",
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
    //Fully deletes item
    serverDeleteItem: function(item, success) {
        return $.ajax({
            url: '/items/' + item._id,
            type: "DELETE",
            success: success
        });
    },
    //////////////////////////////////////////ITEMS//////////////////////////////////////


    ///////////////////////////////////////////SEARCH///////////////////////////////////////

    searchItem: function (query, success) {
        return $.ajax({
            url: '/search/' + query,
            type: "GET",
            success: success
        });
    }
};

for(var p in proto) {
    State1.prototype[p] = proto[p];
}

module.exports = new State1();
