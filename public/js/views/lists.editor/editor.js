var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var List = require('models/list');
var AppView = require('views/view');
var ListsEditorList = require('views/lists.editor/list');
var template = require('templates/lists/lists.editor');
var ListsEditor = AppView.extend({
    attributes: function () {
        return {
            class: 'lists-editor'
        }
    },
    events: {
        "keyup": "keypressed"
    },
    initializeView: function () {
        var self = this;
        this.listenTo(this.collection, 'add', function (list) {
            self.renderList(list)
            self.trigger("listAdded", list);
        });
    },
    renderView: function () {
        var self = this;
        var compiledTemplate = _.template(template, {});
        this.$el.html(compiledTemplate);
        this.collection.each(function (list) {
            if (list.isUserList())
                self.renderList(list)
        })
        //Prepare autocomplete
        this.prepareTypeAhead();
        return this;
    },
    renderList: function (list) {
        var self = this;
        var listsEditorListView = new ListsEditorList({model: list});
        this.$('.editor-lists').prepend(listsEditorListView.render().el);
        this.listenTo(listsEditorListView, 'listRemoved', function (list) {
            self.collection.remove(list);
            self.stopListening(listsEditorListView);
            self.trigger("listRemoved", list);
        });
    },
    prepareTypeAhead: function () {
        var self = this;
        this.$('.editor-list-input').typeahead({
            autoselect: false,
            source: this.getUserListsList(),
            //TODO: implement something like sublime text 2 for autocomplete
            /*,
             matcher: function (item) {

             },
             sorter: function (items) {

             },
             highlighter: function (item) {

             },*/
            updater: function (item) {
                if (item)
                    self.addList(item)
                else
                    self.addList(self.$('.editor-list-input').val())
            }
        });
    },
    getUserListsList: function () {
        //TODO: review this if we load lists from server async in the future
        var self = this;
        return _.chain(_state.lists)
            .values()
            .filter(function (list) {
                return !self.collection.contains(list) && list.isUserList();
            })
            .map(function (list) {
                var filter = list.getFilter();
                return filter.substring(5, filter.length);
            })
            .value();
    },
    postRender: function () {
    },
    keypressed: function (event) {
        if (event.keyCode === 13) {
            event.stopPropagation();
            var $target = $(event.target);
            //If enter inside form, we submit it
            if ($target.hasClass("editor-list-input")) {
                var $input = $target;
                this.addList($input.val());
                $input.val('');
            }
        }
    },
    addList: function (label) {
        var filter = 'Lists/' + $.trim(label);
        //Check if already exists
        if (this.collection.filter(function (list) {
            return list.getFilter() === filter;
        }).length > 0)
            return;
        var list = _state.getListByFilter(filter);
        if (!list)
            list = this.createList(filter);
        this.collection.add(list);
    },
    createList: function (filter) {
        var index = filter.lastIndexOf('/'); //It has at least one /
        var path = filter.substring(0, index);
        var label = filter.substring(index + 1);
        return new List({
            label: label,
            path: path
        });
    }
});
module.exports = ListsEditor;
