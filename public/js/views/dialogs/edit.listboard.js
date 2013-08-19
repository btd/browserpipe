/*var $ = require('jquery');
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
        "hidden": "hidden",
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
        var title = "Create listboard";
        var showTrash = false;
        var optSaveLabel = "Create";
        if (this.model) {
            title = "Edit listboard";
            showTrash = true;
            optSaveLabel = "Save changes";
        }
        var compiledTemplate = _.template(template, {
            listboard: this.model,
            title: title,
            showTrash: showTrash,
            optSaveLabel: optSaveLabel
        });
        this.$el.html(compiledTemplate).appendTo('#dialogs').modal('show');
        return this;
    },
    postRender: function () {

    },
    save: function () {
        var self = this;
        this.cleanErrors();
        var label = $.trim(this.$('[name=dash-label]').val());
        this.validateFields(label);
        if (!this.hasErrors())
            if (this.model)
                this.model.save({label: label}, {wait: true, success: function () {
                    self.close();
                }});
            else
                this.collection.create({label: label}, {wait: true, success: function (listboard) {
                    self.collection.setCurrentListboard(listboard.get('_id'));
                    self.close();
                    _state.listboards.setCurrentListboard(listboard);
                }})
    },
    cleanErrors: function () {
        this.unSetAllErrorFields(this.$("#dash-label"));
    },
    validateFields: function (label) {
        if (label == "")
            this.setErrorField(this.$("#dash-label"), this.$("#dash-label-blank"));
    },
    close: function () {
        this.$el.modal('hide');
    },
    shown: function () {
        this.$('[name=dash-label]').focus();
    },
    hidden: function () {
        this.dispose();
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
                $(".opt-save").click();
            }
        }
    }
});
module.exports = EditListboard;
*/