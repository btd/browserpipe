var $ = require('jquery'),
    _ = require('lodash');

var item = require('./data/item'),
    Item = item.Item,
    Items = item.Items;

var typeObject = require('./data/typeobject'),
    TypeObject = typeObject.TypeObject;

$.ajaxSetup({
    dataType: 'json',
    contentType: 'application/json'
});

var model = require('moco').model;

var State1 = model()
    .attr('browser')
    .attr('items', { collection: Items })
    .attr('selected')
    .use(model.nestedObjects);

_.extend(State1.prototype, {

    loadInitialData: function (initialOptions) {

        //Load items
        this.loadItems(initialOptions.items || []);

        this.selected = this.browser = this.getItemById(initialOptions.user.browser);
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
    },

    ///////////////////////////////////////////SEARCH///////////////////////////////////////


});

module.exports = new State1();
