var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Container = require('views/center/container/container');
var ContainerItem = require('views/center/container/item/item');

var NowContainer = Container.extend({
    initializeView: function (options) {
    	Container.prototype.initializeView.call(this, options);
    },
    renderView: function () {
        this
            .renderMenuOptions()
            .renderHeader()
            .renderBox()
            .renderItems();
        return this;
    },
    renderItems: function () {
        $('.box', this.el).append('<ul class="items"></ul>');
        var items = this.model.getItems();
        for (index in items.models) {
            this.renderItem(items.at(index));
        };
        return this;
    },
    renderItem: function (item) {
        var $items = this.$('.items');
        var containerItem = new ContainerItem({model: item});
        $items.append(containerItem.render().el);
    }
});
module.exports = NowContainer;
