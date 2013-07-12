var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var AppView = require('views/view');
var template = require('templates/dialogs/edit.list');
var EditList = AppView.extend({
    attributes: function () {
        return {
            class: 'modal hide fade',
            id: 'modal-edit-list'
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
        this.editMode = options.editMode
    },
    renderView: function () {
        var title = "Create list";
        var editMode = false;
        var optSaveLabel = "Create";
        var list;
        if (this.editMode) {
            title = "Edit list";
            editMode = true;
            optSaveLabel = "Save changes";
            list = this.model;
        }
        var compiledTemplate = _.template(template, {
            list: list,
            title: title,
            editMode: editMode,
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
        var label = $.trim(this.$('[name=list-label]').val());
        this.validateFields(label);
        if (!this.hasErrors())
            if (this.editMode)
                this.model.save({
                    label: label
                }, {wait: true, success: function () {
                    self.close();
                }});
            else {
                var openContainer = this.$('[name=list-open]').is(':checked');
                this.model.children.createList({
                    label: label,
                    path: this.model.getFilter()
                }).then(function (list) {
                        _state.addList(list);
                        if (openContainer)
                            self.trigger("listAdded", list);
                        self.close();
                    });
            }
    },
    cleanErrors: function () {
        this.unSetAllErrorFields(this.$("#list-label"));
    },
    validateFields: function (label) {
        if (label == "")
            this.setErrorField(this.$("#list-label"), this.$("#list-label-blank"));
    },
    close: function () {
        this.$el.modal('hide');
    },
    shown: function () {
        this.$('[name=list-label]').focus();
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
    moveToTrashConfirmed: function () {
        console.log("move-to-trash")
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
module.exports = EditList;
