var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var Import = require('views/dialogs/import');
var template = require('templates/dialogs/import.twitter');
var ImportTwitter = Import.extend({
    attributes: function () {
        return {
            class: 'modal hide fade',
            id: 'modal-import-twitter'
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
        var parentList = _state.getListByFilter("Imports/Twitter");
        this.createListAndContainerAndClose(label, parentList);
    }
});
module.exports = ImportTwitter;
