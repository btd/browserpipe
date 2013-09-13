var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Lists = require('collections/lists');
var _state = require('models/state');
var AppView = require('views/view');
var ListsEditor = require('views/lists.editor/editor');
var template = require('templates/dialogs/view.url');

var ViewURL = AppView.extend({
    attributes: function () {
        return {
            class: 'modal hide fade',
            id: 'modal-view-bkmkr'
        }
    },
    events: {
        "shown": "shown",
        "hidden": "hidden",        
        "keyup": "keypressed",
        "click .edit-item-title": "showEditItemTitleControls",
        "click .opt-cancel-edit-item-title": "hideEditItemTitleControls",
        "click .opt-save-edit-item-title": "saveItemTitle",
        "click .edit-item-note": "showEditItemNoteControls",
        "click .opt-cancel-edit-item-note": "hideEditItemNoteControls",
        "click .opt-save-edit-item-note": "saveItemNote",
    },
    initializeView: function () {
    },
    renderView: function () {
        var compiledTemplate = _.template(template, {
            item: this.model
        });
        this.$el.html(compiledTemplate).appendTo('#dialogs');
        //Append the lists
        var lists = this.model.getLists();
        this.listsView = new ListsEditor({collection: new Lists(lists)})
        this.listenTo(this.listsView, 'listAdded', this.addList);
        this.listenTo(this.listsView, 'listRemoved', this.updateLists);
        this.$('.item-lists').html(this.listsView.render().el);
        //Show dialog
        this.$el.modal('show');
        return this;
    },
    postRender: function () {

    },    
    addList: function (list) {
        _state.createListIfNew(list.getFilter());
        var lists =  _.compact(_.uniq(this.listsView.collection.map(function (list) {
            return list.getFilter();
        })));  //no blanks and non repeated
        this.model.save({
            lists: lists
        })
    },
    close: function () {
        this.$el.modal('hide');
    },
    shown: function () {
        this.$('[name=item-url]').focus();
    },
    hidden: function () {
        this.dispose();
    },
    keypressed: function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            var $target = $(event.target);
            //If enter inside form, we submit it
            if ($target.attr('id') === 'item-title') {
                $(".opt-save-edit-item-title").click();
            }
            else if ($target.attr('id') === 'item-note') {
                $(".opt-save-edit-item-note").click();
            }
        }
    },
    showEditItemTitleControls: function () {
        this.$('.edit-item-title-controls').show();
        this.$('#item-title').focus();
    },
    hideEditItemTitleControls: function () {
        this.cleanErrors();
        this.$('.edit-item-title-controls').hide();
    },
    saveItemTitle: function () {
        var self = this;
        this.cleanErrors();
        var title = $.trim(this.$('[name=item-title]').val());
        this.validateItemTitle(title);
        if (!this.hasErrors()) {
            //We save the title
            this.model.save({
                title: title
            }).then(function () {
                    self.$('.edit-item-title').html(title);
                    self.hideEditItemTitleControls();
                });
        }
    },
    validateItemTitle: function (title) {
        if (title === "")
            this.setErrorField(this.$("#item-title"), this.$("#item-title-blank"));
    },
    showEditItemNoteControls: function () {
        this.$('.edit-item-note').hide();
        this.$('.edit-item-note-controls').show();
        this.$('.modal-body').animate({scrollTop: this.$('.edit-item-note-controls').offset().top}, 150);
        this.$('#item-note').focus();
    },
    hideEditItemNoteControls: function () {
        this.cleanErrors();
        this.$('.edit-item-note').show();
        this.$('.edit-item-note-controls').hide();
    },
    saveItemNote: function () {
        var self = this;
        this.cleanErrors();
        var note = $.trim(this.$('[name=item-note]').val());
        //We save the note
        this.model.save({
            note: note
        }).then(function () {
                self.$('.item-note-content').html(note);
                self.hideEditItemNoteControls();
            });
    },
    cleanErrors: function () {
        this.unSetAllErrorFields(this.$("#item-note"));
    }
});
module.exports = ViewURL;
