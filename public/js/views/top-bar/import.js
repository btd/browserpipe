var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var AppView = require('views/view');
var ImportFile = require('views/dialogs/import.file');
var ImportTwitter = require('views/dialogs/import.twitter');
var ImportFacebook = require('views/dialogs/import.facebook');
var ImportDelicious = require('views/dialogs/import.delicious');
var ImportPinboard = require('views/dialogs/import.pinboard');
var Import = AppView.extend({
    el: $("#opt-import"),
    events: {
        "click .import-open": "openImportContainer",
        "click .import-new-file": "newImportFileDialog",
        "click .import-new-twitter": "newImportTwitterDialog",
        "click .import-new-facebook": "newImportFacebookDialog",
        "click .import-new-delicious": "newImportDeliciousDialog",
        "click .import-new-pinboard": "newImportPinboardDialog"
    },
    initializeView: function () {
        this.list = _state.getListByFilter("Imports");
    },
    openImportContainer: function (e) {
        e.preventDefault();
        _state.listboards.getCurrentListboard().addContainer({
            "filter": this.list.getFilter(),
            "order": 0, //TODO: manage order
            "title": this.list.get('label'),
            "type": 3
        }, {wait: true, success: function (container) {
            _state.listboards.setCurrentContainer(container.get('_id'));
        }});
        this.hideDropDown();
    },
    hideDropDown: function () {
        //Hides the dropdown
        this.$('[data-toggle="dropdown"]').parent().removeClass('open');
    },
    newImportFileDialog: function (e) {
        e.preventDefault();
        var importFile = new ImportFile();
        importFile.render();
        this.hideDropDown();
    },
    newImportTwitterDialog: function (e) {
        e.preventDefault();
        var importTwitter = new ImportTwitter();
        importTwitter.render();
        this.hideDropDown();
    },
    newImportFacebookDialog: function (e) {
        e.preventDefault();
        var importFacebook = new ImportFacebook();
        importFacebook.render();
        this.hideDropDown();
    },
    newImportDeliciousDialog: function (e) {
        e.preventDefault();
        var importDelicious = new ImportDelicious();
        importDelicious.render();
        this.hideDropDown();
    },
    newImportPinboardDialog: function (e) {
        e.preventDefault();
        var importPinboard = new ImportPinboard();
        importPinboard.render();
        this.hideDropDown();
    }
});
module.exports = Import;
