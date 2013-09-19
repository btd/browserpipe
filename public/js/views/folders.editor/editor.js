var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var Folder = require('models/folder');
var AppView = require('views/view');
var FoldersEditorFolder = require('views/folders.editor/folder');
var template = require('templates/folders/folders.editor');

var FoldersEditor = AppView.extend({
    attributes: function() {
        return {
            class: 'folders-editor'
        }
    },
    events: {
        "keyup": "keypressed"
    },
    initializeView: function() {
        var self = this;
        this.listenTo(this.collection, 'add', function(folder) {
            self.renderFolder(folder)
            self.trigger("folderAdded", folder);
        });
    },
    renderView: function() {
        var self = this;
        var compiledTemplate = _.template(template, {});
        this.$el.html(compiledTemplate);
        this.collection.each(function(folder) {            
            if (folder.isUserFolder())
                self.renderFolder(folder)
        })
        //Prepare autocomplete
        this.prepareTypeAhead();
        return this;
    },
    renderFolder: function(folder) {
        var self = this;
        var foldersEditorFolderView = new FoldersEditorFolder({
            model: folder
        });
        this.$('.editor-folders').prepend(foldersEditorFolderView.render().el);
        this.listenTo(foldersEditorFolderView, 'folderRemoved', function(folder) {
            self.collection.remove(folder);
            self.stopListening(foldersEditorFolderView);
            self.trigger("folderRemoved", folder);
        });
    },
    prepareTypeAhead: function() {
        var self = this;
        this.$('.editor-folder-input').typeahead({
            autoselect: false,
            source: this.getUserFoldersFolder(),
            //TODO: implement something like sublime text 2 for autocomplete
           /* matcher: function(item) {

            },
            sorter: function(items) {

            },
            highlighter: function(item) {

            },*/
            updater: function(item) {
                if (item)
                    self.addFolder(item)
                else
                    self.addFolder(self.$('.editor-folder-input').val())
            }
        });
    },
    getUserFoldersFolder: function() {
        //TODO: review this if we load folders from server async in the future
        var self = this;        
        return _.chain(_state.getAllFolders())
            .filter(function(folder) {
                return !self.collection.contains(folder) && folder.isUserFolder();
            })
            .map(function(folder) {
                var filter = folder.getFilter();
                return filter.substring(8, filter.length);
            })
            .value();
    },
    postRender: function() {},
    keypressed: function(event) {
        if (event.keyCode === 13) {
            event.stopPropagation();
            var $target = $(event.target);
            //If enter inside form, we submit it
            if ($target.hasClass("editor-folder-input")) {
                var $input = $target;
                this.addFolder($input.val());
                $input.val('');
            }
        }
    },
    addFolder: function(label) {
        var filter = 'Folders/' + $.trim(label);
        //Check if already exists
        if (this.collection.filter(function(folder) {
            return folder.getFilter() === filter;
        }).length > 0)
            return;
        var folder = _state.getFolderByFilter(filter);
        if (folder)
            this.collection.add(folder);
        else
            this.createAndAddFolder(filter);
    },
    createAndAddFolder: function(filter) {
        var self = this;
        _state.createFolderIfNew(filter).done(function(folder) {
            self.collection.add(folder);
        });
    }
});
module.exports = FoldersEditor;