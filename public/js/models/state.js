var Backbone = require('backbone'),
    Listboards = require('collections/listboards'),
    ItemCollection = require('collections/items'),
    List = require('models/list'),
    _ = require('lodash');

var State = Backbone.Model.extend({
    lists: {},
    loadInitialData: function () {

        //Loads Lists
        this.loadLists();

        //Loads Listboards
        this.loadListboards();

        //Load items
        this.loadItems();
    },
    loadLists: function () {
        //Load children lists
        var initialLists = initialOptions.lists || [];
        _.each(initialLists, function (listItem) {
            var list = new List(listItem);
            this.lists[list.getFilter()] = list;
            if (!_.isEmpty(list.get('path'))) {
                var parentList = this.lists[list.get('path')];
                parentList.addChildren(list);
            }
            this.listFilterChangedEvent(list);
            this.listDeletedEvent(list);
        }, this);
    },
    addList: function (list) {
        this.lists[list.getFilter()] = list;
    },
    listFilterChangedEvent: function (list) {
        //If filter change, it updates the key
        var self = this;
        this.listenTo(list, 'filterChanged', function (filter, oldFilter) {
            delete self.lists[oldFilter]
            self.lists[filter] = list;
        });
    },
    listDeletedEvent: function (list) {
        //If the list is deleted, it removes it from lists
        var self = this;
        this.listenTo(list, 'deleted', function (list) {
            delete self.lists[list.getFilter()]
        });
    },
    loadListboards: function () {
        this.listboards = new Listboards(initialOptions.listboards)
    },
    loadItems: function () {
        var self = this;
        for (index in initialOptions.items) {
            var item = initialOptions.items[index];
            _.map(item.lists, function (filter) {
                var list = self.getListByFilter(filter);
                if (list) {
                    if (!list.items)
                        list.items = new ItemCollection();
                    list.addItem(item);
                }
            });
        }
    },
    //TODO: Now all lists are loaded in memory.
    //      It should loads lists from server in an optmized way
    //      And this method shoud return a promise
    getListByFilter: function (filter) {
        return this.lists[filter];
    },
    getItemsByFilter: function (filter) {
        //TODO: load items
        return [];
    },
    addItemToLists: function (item) {
        var self = this;
        _.map(item.get('lists'), function (filter) {
            var list = self.getListByFilter(filter);
            if (list)
                list.addItem(item);
        });
    },
    createListIfNew: function (filter) {
        var self = this;
        if (filter != 'Lists' && filter.substring(0, 5) != "Lists/")
            return null;
        var defer = $.Deferred();
        var list = this.getListByFilter(filter);
        if (!list) { //If it does not extists, it creates it
            var index = filter.lastIndexOf('/'); //It has at least one "/"
            var path = filter.substring(0, index);
            var label = filter.substring(index + 1);
            //Gets or creates the parent
            this.createListIfNew(path)
                .done(function (parent) {
                    parent.children.createList({
                        label: label,
                        path: path
                    })
                    .done(function (list) {
                        self.addList(list);
                        defer.resolve(list);
                    });
                });
        }
        else  //Resolves with the list if existis
            defer.resolve(list);
        return defer;
    }
});

module.exports = new State();

