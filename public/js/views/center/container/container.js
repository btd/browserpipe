var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var AppView = require('views/view');
var ContainerHeader = require('views/center/container/header/header');
var ContainerItem = require('views/center/container/item/item');
var template = require('templates/containers/container');

var Container = AppView.extend({
    tagName: 'div',
    events: {
        "click": "selectContainer",
        "click .close-container": "close"
    },
    initializeView: function (options) {
        this.containerItemViews = [];
        this.listenToItemsEvents();
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
    renderContainer: function() {
        var compiledTemplate = _.template(template, {});
        $(this.el).html(compiledTemplate);
        return this;
    },
    renderView: function () {
        this         
            .renderContainer()   
            .renderHeader()
            .renderItems()
            .renderFooter();
        return this;
    },
    renderHeader: function () {
        this.header = new ContainerHeader({ model: this.model });
        this.$('.header').append(this.header.render().el);
        return this;
    },
    renderFooter: function () {
    },
    getItems: function () {
        return this.model.getItems();
    },
    renderItems: function () {
        var items = this.getItems();
        for (var index in items.models) {
            this.renderItem(items.at(index));
        }
        return this;
    },
    renderItem: function (item) {
        var $items = this.$('.items');
        var containerItemView = new ContainerItem({model: item});
        this.containerItemViews.push(containerItemView);
        this.listenToItemEvents(containerItemView);        
        $items.append(containerItemView.render().el);
    },
    listenToItemsEvents: function() {
        this.listenTo(this.model.getItems(), 'add', this.itemAdded, this);
        this.listenTo(this.model.getItems(), 'remove', this.itemRemoved, this);
    },
    listenToItemEvents: function (containerItemView) {
        this.listenTo(containerItemView, "itemRemoved", this.removeItem, this);
    },
    removeItem: function(itemView) { //overrided by future container        
        var self = this;
        itemView.model.save({
            containers: _.without(itemView.model.get('containers'), this.model.id)
        }, {wait: true, success: function (item) {
            self.itemRemoved(item);
        }})        
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
