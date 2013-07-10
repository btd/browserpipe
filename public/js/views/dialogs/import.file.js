var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var Import = require('views/dialogs/import');
var template = require('templates/dialogs/import.file');
var ImportFile = Import.extend({
    attributes: function () {
        return {
            class: 'modal hide fade',
            id: 'modal-import-file'
        }
    },
    initializeView: function (options) {
    },
    prepareTemplate: function () {
        return _.template(template, {
        });
    },
    postRender: function () {

    },
    save: function () {
        var label = this.getCurrentTime();
        var parentList = _state.getListByFilter("Imports/File");
        this.createListAndContainerAndClose(label, parentList);
    }
});
module.exports = ImportFile;
