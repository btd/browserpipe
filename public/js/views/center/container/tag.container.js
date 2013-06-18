var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var Container = require('views/center/container/container');
var ContainerChildTag = require('views/center/container/tag/child.tag');
var ContainerItem = require('views/center/container/item/item');
var TagContainer = Container.extend({
    collapsed: false,
    events: {
        "click .container-tag-icon": "navigateToParentTag"
    },
    initializeView: function (options) {
        var self = this;
        Container.prototype.initializeView.call(this, options);
        _.extend(this.events, Container.prototype.events)
        //Listen to tag events
        this.listenTagEvents();
    },
    renderView: function () {
        this
            .renderMenuOptions()
            .renderHeader()
            .renderBox()
            .renderChildsTags()
            .renderItems();
        return this;
    },
    renderChildsTags: function () {
        var $tags = $('<ul class="tags ' + (this.collapsed ? ' collapsed' : '') + '"></ul>');
        $('.box', this.el).append($tags);
        //Render childs tags
        for (var i = 0, l = this.model.tag.children.length; i < l; i++) {
            var childTag = this.model.tag.children.models[i];
            this.renderChildTag(childTag);
        }
        ;
        return this;
    },
    renderChildTag: function (childTag) {
        var $tags = this.$('.tags');
        var cct = new ContainerChildTag({tag: childTag});
        $tags.append(cct.render().el);
        this.listenTo(cct, 'navigateToTag', this.navigateToTag);
    },
    renderItems: function () {
        $('.box', this.el).append('<ul class="items"></ul>');
        var items = this.model.tag.getItems();
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
    listenTagEvents: function () {
        //If an item is added, we render it
        this.listenTo(this.model.tag.children, 'add', this.renderChildTag);
        //If an item is added, we render it
        this.listenTo(this.model.tag.getItems(), 'add', this.renderItem);
    },
    navigateToTag: function (tag) {
        //Unbind old tag events
        this.stopListening(this.model.tag.children);
        this.stopListening(this.model.tag.getItems());
        //Sets the new tag
        this.model.set('title', tag.get('label'));
        this.model.set('filter', tag.getFilter());
        this.model.save();
        this.model.tag = tag;
        //Listen to new tag events
        this.listenTagEvents();
        //Clears content
        this.clean();
        //Render the view again
        this.render();
        //Sets as the current container
        _state.dashboards.setCurrentContainer(this.model.get('_id'));
    },
    navigateToParentTag: function () {
        var parent = _state.getTagByFilter(this.model.tag.get('path'));
        if (parent)
            this.navigateToTag(parent);
    }
});
module.exports = TagContainer;
