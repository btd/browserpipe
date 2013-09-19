var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var AppView = require('views/view');
var template = require('templates/containers/folder');

var ContainerChildFolder = AppView.extend({
    name: 'ContainerChildFolder',
    tagName: 'li',
    events: {
        "click": "navigateToFolder",
        "mouseenter": "showRemoveChildFolderIcon",
        "mouseleave": "hideRemoveChildFolderIcon",
        "click .remove-child-folder": "removeChildFolder"
    },
    attributes: function () {
        return {
            class: 'folder'
        }
    },
    initializeView: function () {
        this.listenTo(this.model, 'change:label', function () {
            this.render();
        }, this);
    },
    renderView: function () {
        var compiledTemplate = _.template(template, { label: this.model.get('label') });
        $(this.el).html(compiledTemplate);
        return this;
    },
    navigateToFolder: function (e) {
        e.stopPropagation();
        this.trigger("navigateToFolder", this.model);
    },
    showRemoveChildFolderIcon: function () {
        this.$('.remove-child-folder').show();
    },
    hideRemoveChildFolderIcon: function () {
        this.$('.remove-child-folder').hide();
    },
    removeChildFolder: function (e) {
        e.stopPropagation();
        this.model.destroy({ success: function (model, response) {
            _state.removeFolder(model);
        }});
    }

});
module.exports = ContainerChildFolder;
