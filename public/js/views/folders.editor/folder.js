var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var AppView = require('views/view');
var template = require('templates/folders/folders.editor.folder');
var FoldersEditorFolder = AppView.extend({
    attributes: function () {
        return {
            class: 'folders-editor-folder'
        }
    },
    events: {
        "click .close": "removeFolder"
    },
    initializeView: function () {
    },
    renderView: function () {
        var filter = this.model.getFilter();
        var compiledTemplate = _.template(template, {
            label: filter.substring(6, filter.length)
        });
        this.$el.html(compiledTemplate);
        return this;
    },
    removeFolder: function (e) {
        this.trigger('folderRemoved', this.model);
        this.dispose();
    }
});
module.exports = FoldersEditorFolder;
