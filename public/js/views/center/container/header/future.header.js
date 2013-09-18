var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var AppView = require('views/view');
var template = require('templates/containers/future.header');
var FutureContainerHeader = AppView.extend({
    tagName: 'div',
    events: {
        'click .title': 'editTitle',
        'click .edit-title-save': 'saveEditTitle',
        'click .edit-title-cancel': 'cancelEditTitle',
        "keyup .edit-title input": "keypressed"
    },
    attributes: function () {
        return {
            class: 'header-inner'
        }
    },
    initializeView: function () {
        this.icon = this.options.icon;
        //Renders title if it changes
        var self = this;
        this.listenTo(this.model, 'change:label', function () {
            self.render();
        });
    },
    renderView: function () {
        var compiledTemplate = _.template(template, {folder: this.model, icon: this.icon});
        $(this.el).html(compiledTemplate);
        return this;
    },
    editTitle: function () {
        this.$('.title').hide();
        this.$('.edit-title').show();
        this.$('.edit-title input').focus();
    },
    saveEditTitle: function () {
        var self = this;
        var label = this.$('.edit-title input').val();
        this.model.save({
            label: label
        }, {
            success: function () {
                self.hideEditTitle();
            }
        });
    },
    cancelEditTitle: function () {
        this.hideEditTitle();
    },
    hideEditTitle: function () {
        this.$('.edit-title').hide();
        this.$('.title').show();
    },
    keypressed: function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            this.saveEditTitle();
        }
    }
});
module.exports = FutureContainerHeader;
