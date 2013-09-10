var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var AppView = require('views/view');
var template = require('templates/containers/header');
var ContainerHeader = AppView.extend({
    tagName: 'div',
    events: {
        'click .title': 'editTitle',
        'click .edit-title-save': 'saveEditTitle',
        'click .edit-title-cancel': 'cancelEditTitle'
    },
    attributes: function () {
        return {
            class: 'header'
        }
    },
    initializeView: function () {
        this.icon = this.options.icon;
        //Renders title if it changes
        var self = this;
        this.listenTo(this.model, 'change:title', function () {
            self.$('.title').html(self.model.get('title'));
        });
    },
    renderView: function () {
        var compiledTemplate = _.template(template, {container: this.model, icon: this.icon});
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
        var title = this.$('.edit-title input').val();
        this.model.save({
            title: title
        }, {
            success: function () {
                self.render();
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
    }
});
module.exports = ContainerHeader;
