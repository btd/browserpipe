var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var AppView = require('views/view');
var ViewURL = require('views/dialogs/view.url');
var mainTemplate = require('templates/items/container.item.simple');

var ContainerItem = AppView.extend({
    name: 'ContainerItem',
    tagName: 'li',
    events: {
        "click": "open",
        "click a": "stopPropagation"
    },
    attributes: function () {
        return {
            class: 'item',
            id: "item_" + this.model.get('_id')
        }
    },
    initializeView: function () {
    },
    renderView: function () {
        var compiledTemplate = _.template(mainTemplate, {item: this.model});
        $(this.el).html(compiledTemplate);
        return this;
    },
    postRender: function () {
    },
    open: function () {
        var viewURL = new ViewURL({model: this.model});
        viewURL.render();
    },
    stopPropagation: function (e) {
        e.stopPropagation();
    }
});
module.exports = ContainerItem;
