var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Container = require('views/center/container/container');
var AddItem = require('views/center/container/item/item.add');

var LaterContainer = Container.extend({
    initializeView: function (options) {
		Container.prototype.initializeView.call(this, options);
    },
    renderFooter: function () {
        this.footer = new AddItem({ model: this.model });
        this.$('.footer').append(this.footer.render().el);
        return this;
    }
});
module.exports = LaterContainer;
