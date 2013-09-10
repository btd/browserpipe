var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var Container = require('views/center/container/container');
var ContainerChildList = require('views/center/container/list/child.list');
var ListsTemplate = require('templates/containers/lists');
var AddBookmark = require('views/dialogs/add.bookmark');

var FutureContainer = Container.extend({
    initializeView: function (options) {
        Container.prototype.initializeView.call(this, options);
        this.events['click .container-list-icon'] = 'navigateToParentList';
        this.events['click .add-list-icon'] = 'addList';
        this.events['click .add-list-save'] = 'saveAddList';
        this.events['click .add-list-cancel'] = 'cancelAddList';
        this.events['click .opt-add-bkmrk'] = 'addBkmrk';
    },
    renderView: function () {
        this       
            .renderContainer()     
            .renderHeader()            
            .renderChildsLists()
            .renderItems();
        return this;
    },
    renderChildsLists: function () {
        var compiledTemplate = _.template(ListsTemplate, { collapsed: this.collapsed });
        $('.box', this.el).append(compiledTemplate);
        //Render childs lists
        for (var i = 0, l = this.model.list.children.length; i < l; i++) {
            var childList = this.model.list.children.models[i];
            this.renderChildList(childList);
        }
        return this;
    },
    renderChildList: function (childList) {
        var $lists = this.$('.lists');
        var cct = new ContainerChildList({model: childList});
        $lists.append(cct.render().el);
        this.listenTo(cct, 'navigateToList', this.navigateToList);
        this.listenTo(cct, 'childRemoved', this.childRemoved, this);
    },
    childRemoved: function (childView) {
        this.model.list.removeChildren(childView.model, {
            wait: true,
            success: function () {
                childView.dispose();
            }
        });
    },
    listenListEvents: function () {
        //If an item is added, we render it
        this.listenTo(this.model.list.children, 'add', this.renderChildList);
        //If an item is added, we render it
        this.listenTo(this.model.list.getItems(), 'add', this.renderItem);
    },
    navigateToList: function (list) {
        //Unbind old list events
        this.stopListening(this.model.list.children);
        this.stopListening(this.model.list.getItems());
        //Sets the new list
        this.model.set('title', list.get('label'));
        this.model.set('filter', list.getFilter());
        this.model.save();
        this.model.list = list;
        //Listen to new list events
        this.listenListEvents();
        //Clears content
        this.clean();
        //Render the view again
        this.render();
    },
    navigateToParentList: function () {
        var parent = _state.getListByFilter(this.model.list.get('path'));
        if (parent)
            this.navigateToList(parent);
    },
    addList: function () {
        this.$('.add-list').show();
        this.$('.add-list input').focus();
        this.scrollToAddList();
    },
    saveAddList: function () {
        var self = this;
        var label = this.$('.add-list input').val();
        this.model.list.children.createList({
            label: label,
            path: this.model.list.getFilter()
        }).then(function (list) {
                _state.addList(list);
                self.renderChildList(list);
                self.hideAddList();
                self.$('.add-list input').val('')
            });
    },
    cancelAddList: function () {
        this.hideAddList();
    },
    hideAddList: function () {
        this.$('.add-list').hide();
    },
    scrollToAddList: function () {
        this.$('.box').animate({scrollTop: this.$('.add-list').offset().left + 60}, 150);
    },
    addBkmrk: function () {
        var addBookmark = new AddBookmark({list: this.model.list});
        addBookmark.render();
    }
});
module.exports = FutureContainer;
