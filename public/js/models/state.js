var Backbone = require('backbone'),
    Browsers = require('collections/browsers'),
    Listboards = require('collections/listboards'),
    ItemCollection = require('collections/items'),
    List = require('models/list'),
    _ = require('lodash');

var State = Backbone.Model.extend({
    lists: {},
    loadInitialData: function () {

        //Loads Lists
        this.loadLists();

        //Loads NowListboards
        this.loadNowListboards();

        //Loads LaterListboards
        this.loadLaterListboards();

        //Loads FutureListboards
        this.loadFutureListboards();

        //Load items
        this.loadItems();
    },
    loadNowListboards: function () {
        this.nowListboards = new Listboards(initialOptions.nowListboards);
    },
    loadLaterListboards: function () {
        this.laterListboards = new (Listboards.Later)(initialOptions.laterListboards);
    },
    loadFutureListboards: function () {
        this.futureListboards = new (Listboards.Future)(initialOptions.futureListboards);
    },
    loadItemsByContainer: function(container) {

        _.map(initialOptions.items, function(item){            
            if(_.contains(item.containers,container.get('_id')))
                container.addItem(item);
        });
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
    loadBrowsers: function () {        
        this.browsers = new Browsers(initialOptions.browsers)
    },    
    loadItems: function () {
        var self = this;
        for (var index in initialOptions.items) {
            var item = initialOptions.items[index];
            _.each(item.lists, function (filter) {
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
    getListboard: function(listboardType, listboardId) {
        switch(listboardType){
            case 0: return this.nowListboards.get(listboardId);
            case 1: return this.laterListboards.get(listboardId);
            case 2: return this.futureListboards.get(listboardId);
        }            
    },
    addItemToLists: function (item) {
        var self = this;
        _.map(item.get('lists'), function (filter) {
            var list = self.getListByFilter(filter);
            if (list)
                list.addItem(item);
        });
    },
    addItemToContainers: function (listboardType, listboardId, item) {
        var listboard = this.getListboard(listboardType, listboardId);
        if(listboard)
            _.map(item.get('containers'), function (containerId) {
                var container = listboard.containers.get(containerId);
                if(container && !container.items.get(item.cid))
                    container.addItem(item);
            });            
    },
    removeItemFromContainers: function (listboardType, listboardId, containerId, itemId) {
        var listboard = this.getListboard(listboardType, listboardId);
        if(listboard){
            var container = listboard.containers.get(containerId);
            if(container && container.items.get(itemId))
                container.removeItem(itemId);
        }

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

