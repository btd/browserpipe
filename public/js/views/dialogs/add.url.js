/*var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var util = require('util');
var Lists = require('collections/lists');
var _state = require('models/state');
var Item = require('models/item');
var AppView = require('views/view');
var ListsEditor = require('views/lists.editor/editor');
var template = require('templates/dialogs/add.url');

var AddBookmark = AppView.extend({
    attributes: function () {
        return {
            class: 'modal hide fade',
            id: 'modal-add-bkmkr'
        }
    },
    events: {
        "shown": "shown",
        "hidden": "hidden",
        "click .opt-save": "save",
        "click .opt-cancel": "close",
        "submit .form-horizontal": "preventDefault",
        "keyup": "keypressed"
    },
    initializeView: function (options) {
        this.list = options.list;
    },
    renderView: function () {
        var compiledTemplate = _.template(template, {
            item: this.model
        });
        this.$el.html(compiledTemplate).appendTo('#dialogs');
        //Append the lists
        this.listsView = new ListsEditor({collection: new Lists(this.list)})
        this.$('.item-lists').html(this.listsView.render().el);
        //Show the dialog
        this.$el.modal('show');
        return this;
    },
    postRender: function () {

    },
    save: function () {
        var self = this;
        this.cleanErrors();
        var title = this.$('[name=item-title]').val();
        var url = this.$('[name=item-url]').val();
        var note = this.$('[name=item-note]').val();
        var lists = this.listsView.collection.map(function (list) {
            _state.createListIfNew(list.getFilter());
            return list.getFilter();
        });
        this.validateFields(url);
        if (!this.hasErrors()) {
            //We append current list filter
            lists.push(this.list.getFilter());
            //We create the list
            var item = new Item();
            item.save({
                type: 0,
                lists: _.compact(_.uniq(lists)), //no blanks and non repeated
                title: ($.trim(title) == '' ? url : url),
                url: url,
                note: note
            }, {wait: true, success: function (item) {
                _state.addItemToLists(item);
                self.close();
            }})
        }
    },
    cleanErrors: function () {
        this.unSetAllErrorFields(this.$("#item-url"));
    },
    validateFields: function (url) {
        if (url == "")
            this.setErrorField(this.$("#item-url"), this.$("#item-url-blank"));
        else if (!util.isValidURL(url))
            this.setErrorField(this.$("#item-url"), this.$("#item-url-invalid"));
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
module.exports = AddBookmark;
*/