var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var AppView = require('views/view');
var ContainerHeader = require('views/center/container/header/header');
var ContainerItem = require('views/center/container/item/item');

var Container = AppView.extend({
    tagName: 'div',
    events: {
        "click": "selectContainer",
        "click .close-container": "close"
    },
    initializeView: function (options) {
        this.containerItemViews = [];
        this.model.getItems().on('add', this.itemAdded, this);
        this.model.getItems().on('remove', this.itemRemoved, this);
    },
    attributes: function () {
        return {
            class: 'items-container',
            id: "cont_" + this.model.get('_id'),
            'data-id': this.model.get('_id')
        }
    },
    clean: function () {
        $(this.el).empty();
    },
    renderView: function () {
        this
            .renderHeader()
            .renderBox()
            .renderItems();
        return this;
    },
    renderHeader: function () {
        this.header = new ContainerHeader({ model: this.model });
        $(this.el).append(this.header.render().el);
        return this;
    },
    renderBox: function () {
        $(this.el).append('<div class="box"></div>');
        return this;
    },
    renderItems: function () {
        $('.box', this.el).append('<ul class="items"></ul>');
        var items = this.model.getItems();
        for (var index in items.models) {
            this.renderItem(items.at(index));
        }
        return this;
    },
    renderItem: function (item) {
        var $items = this.$('.items');
        var containerItem = new ContainerItem({model: item});
        this.containerItemViews.push(containerItem);
        $items.append(containerItem.render().el);
    },
    itemAdded: function (item) {
        this.renderItem(item);
    },
    itemRemoved: function (item) {
        var containerItemView = _.find(this.containerItemViews, function (cv) {
            return cv.model.id === item.id;
        });
        if (containerItemView) {
            this.containersViews = _.without(this.containerItemViews, containerItemView);
            containerItemView.dispose();
        }
    },
    postRender: function () {
        this.addEvents(this.events);
        this.calculateHeight();
    },
    calculateHeight: function (height) {
        //TODO: check why is needed to rest 30
        var value = height - 60 - (config.CONTAINER_VERTICAL_MARGIN * 2);
        $(".box", this.el).css("max-height", value);
    },
    close: function () {
        this.trigger("close", this);
    }

});

module.exports = Container;
