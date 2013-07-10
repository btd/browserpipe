var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var Import = require('views/dialogs/import');
var template = require('templates/dialogs/import.delicious');
var ImportDelicious = Import.extend({
    attributes: function () {
        return {
            class: 'modal hide fade',
            id: 'modal-import-delicious'
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
        var parentList = _state.getListByFilter("Imports/Delicious");
        this.createListAndContainerAndClose(label, parentList);
    }
});
module.exports = ImportDelicious;
