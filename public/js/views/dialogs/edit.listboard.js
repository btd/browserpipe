var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var AppView = require('views/view');
var template = require('templates/dialogs/edit.listboard');
var EditListboard = AppView.extend({
    attributes: function () {
        return {
            class: 'modal hide fade',
            id: 'modal-edit-dash'
        }
    },
    events: {
        "shown": "shown",
        "click .opt-save": "save",
        "click .opt-cancel": "close",
        "click .opt-move-to-trash": "moveToTrash",
        "click .opt-move-to-trash-no": "moveToTrashCanceled",
        "click .opt-move-to-trash-yes": "moveToTrashConfirmed",
        "submit .form-horizontal": "preventDefault",
        "keyup": "keypressed"
    },
    initializeView: function (options) {
    },
    renderView: function () {
        var compiledTemplate = _.template(template, {});
        this.$el.html(compiledTemplate).appendTo('#dialogs');
        return this;
    },
    show: function() {
        var title = "Create listboard",
            labelValue = "",
            saveLabel = "Create",
            showTrashBlock = false;

        if(this.model) {
            title = "Edit listboard";
            labelValue = this.model.get('label');
            saveLabel = "Save";
            showTrashBlock = true;
        }

        this.$('.js-dialog-title').html(title);
        this.$('[name=dash-label]').val(labelValue);
        this.$(".opt-save").html(saveLabel);

        this.moveToTrashCanceled();
        var trashBlock = this.$('.js-dialog-edit-listboard-trash');
        showTrashBlock ? trashBlock.show() : trashBlock.hide();

        this.$el.modal('show');
    },
    save: function () {
        var self = this;
        this.cleanErrors();
        var label = $.trim(this.$('[name=dash-label]').val());
        this.validateFields(label);
        if (!this.hasErrors())
            if (this.model)
                this.model.save({label: label}, {
                    success: function () {
                        self.close();
                    }
                });
            else {
                this.collection.create({ label: label }, {
                    success: function (listboard) {                        
                        self.collection.setCurrentListboard(listboard.get('_id'));
                        self.close();
                    }
                });
            }
    },
    cleanErrors: function () {
        this.unSetAllErrorFields(this.$("[name=dash-label]"));
    },
    validateFields: function (label) {
        if (label === "")
            this.setErrorField(this.$("[name=dash-label]"), this.$("[name=dash-label] + .help-inline"));
    },
    close: function () {
        this.$el.modal('hide');
    },
    shown: function () {
        this.$('[name=dash-label]').focus();
    },
    moveToTrash: function () {
        this.$('.move-to-trash-alert').slideDown();
    },
    moveToTrashCanceled: function () {
        this.$('.move-to-trash-alert').hide();
    },
    moveToTrashConfirmed: function() {
        var self = this;
        this.model.destroy({ success: function(model, response) {
            self.close();
        }});
    },
    preventDefault: function (event) {
        event.preventDefault();
    },
    keypressed: function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            //If enter inside form, we submit it
            if ($(event.target).parents('.form-horizontal').length > 0) {
                this.$(".opt-save").click();
            }
        }
    }
});
module.exports = EditListboard;