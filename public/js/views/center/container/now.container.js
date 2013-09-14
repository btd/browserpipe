var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Container = require('views/center/container/container');

var NowContainer = Container.extend({
    initializeView: function (options) {
        Container.prototype.initializeView.call(this, options);
    },
    listenToItemsEvents: function() {
        Container.prototype.listenToItemsEvents.call(this);
        this.listenTo(this.model.getItems(), 'add', function () {
            this.header.render();
        }, this);
        this.listenTo(this.model.getItems(), 'remove', function () {
            this.header.render();
        }, this);
    }
});
module.exports = NowContainer;
