var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var AppView = require('views/view');
var template = require('templates/containers/list');

var ContainerChildList = AppView.extend({
    name: 'ContainerChildList',
    tagName: 'li',
    events: {
        "click": "navigateToList",
        "mouseenter": "showRemoveChildListIcon",
        "mouseleave": "hideRemoveChildListIcon",
        "click .remove-child-list": "removeChildList"
    },
    attributes: function () {
        return {
            class: 'list'
        }
    },
    initializeView: function () {
    },
    renderView: function () {
        var compiledTemplate = _.template(template, { label: this.model.get('label') });
        $(this.el).html(compiledTemplate);
        return this;
    },
    navigateToList: function (e) {
        e.stopPropagation();
        this.trigger("navigateToList", this.model);
    },
    showRemoveChildListIcon: function () {
        this.$('.remove-child-list').show();
    },
    hideRemoveChildListIcon: function () {
        this.$('.remove-child-list').hide();
    },
    removeChildList: function (e) {
        e.stopPropagation();
        this.trigger('childRemoved', this);
    }

});
module.exports = ContainerChildList;
