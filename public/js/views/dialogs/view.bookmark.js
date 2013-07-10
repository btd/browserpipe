var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Lists = require('collections/lists');
var _state = require('models/state');
var AppView = require('views/view');
var ListsEditor = require('views/lists.editor/editor');
var template = require('templates/dialogs/view.bookmark');
var ViewBookmark = AppView.extend({
    attributes: function () {
        return {
            class: 'modal hide fade',
            id: 'modal-view-bkmkr'
        }
    },
    events: {
        "shown": "shown",
        "hidden": "hidden",
        "click .opt-save": "save",
        "click .opt-cancel": "close",
        "click .opt-move-to-trash-yes": "moveToTrashConfirmed",
        "keyup": "keypressed",
        "click .edit-bkmrk-title": "showEditBkmrkTitleControls",
        "click .opt-cancel-edit-bkmrk-title": "hideEditBkmrkTitleControls",
        "click .opt-save-edit-bkmrk-title": "saveBkmrkTitle",
        "click .edit-bkmrk-note": "showEditBkmrkNoteControls",
        "click .opt-cancel-edit-bkmrk-note": "hideEditBkmrkNoteControls",
        "click .opt-save-edit-bkmrk-note": "saveBkmrkNote",
    },
    initializeView: function () {
    },
    renderView: function () {
        var compiledTemplate = _.template(template, {
            bookmark: this.model
        });
        this.$el.html(compiledTemplate).appendTo('#dialogs');
        //Append the lists
        var lists = this.model.getLists();
        this.listsView = new ListsEditor({collection: new Lists(lists)})
        this.listenTo(this.listsView, 'listAdded', this.addList);
        this.listenTo(this.listsView, 'listRemoved', this.updateLists);
        this.$('.bkmrk-lists').html(this.listsView.render().el);
        //Show dialog
        this.$el.modal('show');
        return this;
    },
    postRender: function () {

    },
    save: function () {
        var self = this;
        var title = this.$('[name=bkmrk-title]').val();
        var url = this.$('[name=bkmrk-url]').val();
        var note = this.$('[name=bkmrk-note]').val();
        this.model.save({
            title: title,
            url: url,
            note: note,
            lists: _.compact(_.uniq(lists))
        }, {wait: true, success: function () {
            self.close();
        }});
    },
    addList: function (list) {
        _state.createListIfNew(list.getFilter());
        this.updateLists();
    },
    updateLists: function () {
        var lists = this.listsView.collection.map(function (list) {
            return list.getFilter();
        });
        this.model.save({
            lists: _.compact(_.uniq(lists))
        });
    },
    close: function () {
        this.$el.modal('hide');
    },
    shown: function () {
        this.$('[name=bkmrk-url]').focus();
    },
    hidden: function () {
        this.dispose();
    },
    moveToTrashConfirmed: function () {
        console.log("move-to-trash")
    },
    keypressed: function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            var $target = $(event.target);
            //If enter inside form, we submit it
            if ($target.attr('id') === 'bkmrk-title') {
                $(".opt-save-edit-bkmrk-title").click();
            }
            else if ($target.attr('id') === 'bkmrk-note') {
                $(".opt-save-edit-bkmrk-note").click();
            }
        }
    },
    showEditBkmrkTitleControls: function () {
        this.$('.edit-bkmrk-title-controls').show();
        this.$('#bkmrk-title').focus();
    },
    hideEditBkmrkTitleControls: function () {
        this.cleanErrors();
        this.$('.edit-bkmrk-title-controls').hide();
    },
    saveBkmrkTitle: function () {
        var self = this;
        this.cleanErrors();
        var title = $.trim(this.$('[name=bkmrk-title]').val());
        this.validateBkmrkTitle(title);
        if (!this.hasErrors()) {
            //We save the title
            this.model.save({
                title: title
            }).then(function () {
                    self.$('.edit-bkmrk-title').html(title);
                    self.hideEditBkmrkTitleControls();
                });
        }
    },
    validateBkmrkTitle: function (title) {
        if (title === "")
            this.setErrorField(this.$("#bkmrk-title"), this.$("#bkmrk-title-blank"));
    },
    showEditBkmrkNoteControls: function () {
        this.$('.edit-bkmrk-note').hide();
        this.$('.edit-bkmrk-note-controls').show();
        this.$('.modal-body').animate({scrollTop: this.$('.edit-bkmrk-note-controls').offset().top}, 150);
        this.$('#bkmrk-note').focus();
    },
    hideEditBkmrkNoteControls: function () {
        this.cleanErrors();
        this.$('.edit-bkmrk-note').show();
        this.$('.edit-bkmrk-note-controls').hide();
    },
    saveBkmrkNote: function () {
        var self = this;
        this.cleanErrors();
        var note = $.trim(this.$('[name=bkmrk-note]').val());
        //We save the note
        this.model.save({
            note: note
        }).then(function () {
                self.$('.bkmrk-note-content').html(note);
                self.hideEditBkmrkNoteControls();
            });
    },
    cleanErrors: function () {
        this.unSetAllErrorFields(this.$("#bkmrk-note"));
    }
});
module.exports = ViewBookmark;
