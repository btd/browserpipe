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
        "click a": "stopPropagation",
        "click .remove-item": "removeItemClicked",
        "mouseenter": "mouseOverItem",
        "mouseleave": "mouseLeaveItem"
    },
    attributes: function () {
        return {
            class: 'item',
            id: "item_" + this.model.get('_id')
        }
    },
    initializeView: function () {
        var self = this;
        this.listenTo(this.model, 'change:title', function () {
            self.$('.title').html(self.model.get('title'));
        });
        this.listenTo(this.model, 'change:note', function () {
            self.$('.description').html(self.model.get('note'));
        });
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
    removeItemClicked: function(e) {
        e.stopPropagation();
        this.trigger('itemRemoved', this);
    },
    stopPropagation: function (e) {
        e.stopPropagation();
    },
    mouseOverItem: function(e) {
        this.$('.remove-item').show();
        this.$('.favicon').hide();        
    },
    mouseLeaveItem: function(e) {        
        this.$('.favicon').show();        
        this.$('.remove-item').hide();
    }
});
module.exports = ContainerItem;
