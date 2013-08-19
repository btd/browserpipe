/*var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var Container = require('views/center/container/container');
var ContainerChildList = require('views/center/container/list/child.list');
var ContainerItem = require('views/center/container/item/item');

var ListContainer = Container.extend({
    collapsed: false,
    events: {
        "click .container-list-icon": "navigateToParentList"
    },
    initializeView: function (options) {
        var self = this;
        Container.prototype.initializeView.call(this, options);
        _.extend(this.events, Container.prototype.events)
        //Listen to list events
        this.listenListEvents();
    },
    initializeView: function (options) {
        this.listenTo(_state.listboards, 'currentContainerChange', this.currentContainerChanged);
    },
    renderView: function () {
        this
            .renderMenuOptions()
            .renderHeader()
            .renderBox()
            .renderChildsLists()
            .renderItems();
        return this;
    },
    renderChildsLists: function () {
        var $lists = $('<ul class="lists ' + (this.collapsed ? ' collapsed' : '') + '"></ul>');
        $('.box', this.el).append($lists);
        //Render childs lists
        for (var i = 0, l = this.model.list.children.length; i < l; i++) {
            var childList = this.model.list.children.models[i];
            this.renderChildList(childList);
        }
        ;
        return this;
    },
    renderChildList: function (childList) {
        var $lists = this.$('.lists');
        var cct = new ContainerChildList({list: childList});
        $lists.append(cct.render().el);
        this.listenTo(cct, 'navigateToList', this.navigateToList);
    },
    renderItems: function () {
        $('.box', this.el).append('<ul class="items"></ul>');
        var items = this.model.list.getItems();
        for (index in items.models) {
            this.renderItem(items.at(index));
        }
        ;
        return this;
    },
    renderItem: function (item) {
        var $items = this.$('.items');
        var containerItem = new ContainerItem({model: item});
        $items.append(containerItem.render().el);
    },
    postRender: function () {
        Container.prototype.postRender.call(this);
    },
    listenListEvents: function () {
        //If an item is added, we render it
        this.listenTo(this.model.list.children, 'add', this.renderChildList);
        //If an item is added, we render it
        this.listenTo(this.model.list.getItems(), 'add', this.renderItem);
    },
    navigateToList: function (list) {
        //Unbind old list events
        this.stopListening(this.model.list.children);
        this.stopListening(this.model.list.getItems());
        //Sets the new list
        this.model.set('title', list.get('label'));
        this.model.set('filter', list.getFilter());
        this.model.save();
        this.model.list = list;
        //Listen to new list events
        this.listenListEvents();
        //Clears content
        this.clean();
        //Render the view again
        this.render();
        //Sets as the current container
        _state.listboards.setCurrentContainer(this.model.get('_id'));
    },
    navigateToParentList: function () {
        var parent = _state.getListByFilter(this.model.list.get('path'));
        if (parent)
            this.navigateToList(parent);
    }
});
module.exports = ListContainer;
*/