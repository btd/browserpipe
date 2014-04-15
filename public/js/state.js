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
    .attr('items', { collection: Items })
    .attr('selectedFolder')
    .attr('selectedItem')
    .use(model.nestedObjects);

var proto = {

    loadInitialData: function (initialOptions) {

        //Load items
        this.loadItems(initialOptions.items || []);

        this.browser = this.getItemById(initialOptions.user.browser);
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
    serverAddItemToItem: function (parentId, item, success) {
	      item.parent = parentId;
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
