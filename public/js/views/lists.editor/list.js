var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var AppView = require('views/view');
var template = require('templates/lists/lists.editor.list');
var ListsEditorList = AppView.extend({
    attributes: function () {
        return {
            class: 'lists-editor-list'
        }
    },
    events: {
        "click .close": "removeList"
    },
    initializeView: function () {
    },
    renderView: function () {
        var filter = this.model.getFilter();
        var compiledTemplate = _.template(template, {
            label: filter.substring(5, filter.length)
        });
        this.$el.html(compiledTemplate);
        return this;
    },
    removeList: function (e) {
        this.trigger('listRemoved', this.model);
        this.dispose();
    }
});
module.exports = ListsEditorList;
