var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var AppView = require('views/view');
var ContainerChildList = AppView.extend({
    name: 'ContainerChildList',
    tagName: 'li',
    events: {
        "click": "navigateToList"
    },
    attributes: function () {
        return {
            class: 'list',
            //TODO: This should have a real id
            id: "list" + Math.random()
        }
    },
    initializeView: function () {
        this.list = this.options.list;
    },
    renderView: function () {
        $(this.el).html(this.list.get('label'));
        return this;
    },
    postRender: function () {
    },
    navigateToList: function (e) {
        e.stopPropagation();
        this.trigger("navigateToList", this.list);
    }
});
module.exports = ContainerChildList;
