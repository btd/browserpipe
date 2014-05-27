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
    .attr('username')
    .attr('pending')
    .attr('archive')
    .attr('items', { collection: Items })
    .attr('selectedItem')
    .attr('selectedFolder')
    .attr('sidebarTab')
    .attr('sidebarCollapsed')
    .attr('viewScreenshot')
    .attr('config')
    .use(model.nestedObjects);

var proto = {

    loadInitialData: function (initialOptions) {

        //Load items
        this.loadItems(initialOptions.items || []);

        this.username = initialOptions.user.name;

        this.pending = this.getItemById(initialOptions.user.pending);
        this.archive = this.getItemById(initialOptions.user.archive);

        this.config = initialOptions.config;

        //Todo: save this options in user
        this.sidebarCollapsed = true;
        this.viewScreenshot = true;
    },

    //////////////////////////////////////////ITEMS//////////////////////////////////////
    //Load
    loadItems: function (from) {
        from.forEach(this.addItem, this);
    },

    size: function() {
      return this.items.reduce(function(acc, item) {
        return acc + item.size;
      }, 0);
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
        item.size = item.files.reduce(function(acc, file) {
          return acc + (file.size || 0);
        }, 0);
        item = new Item(item);// to have common reference
        this.items.push(item);
    },
    updateItem: function (itemUpdate) {
      var item = this.getItemById(itemUpdate._id);
      if (item) {
        var size = itemUpdate.files.reduce(function(acc, file) {
          return acc + (file.size || 0);
        }, 0);
        item.size = size;
        for(var p in itemUpdate) {
            item[p] = itemUpdate[p];
        }
      }
    },
    removeItem: function (itemId) {
        this.items.removeById(itemId);
    },
    serverAddItem: function (parentId, item, success) {
	      item.parent = parentId;
        $.ajax({
            url: '/items/' + parentId,
            type: "POST",
            data: JSON.stringify(item),
            success: success
        });
    },
    moveItem: function(itemId, parentId, success) {
        return $.ajax({
            url: '/items/' + itemId + '/move/',
            type: "PUT",
            data: JSON.stringify({ parent: parentId }),
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
