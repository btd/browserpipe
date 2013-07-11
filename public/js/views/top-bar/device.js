var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var AppView = require('views/view');
var Import = AppView.extend({
    el: $("#opt-device"),
    events: {
        "click .device-open": "openDeviceContainer",
        "click .device-new": "newDeviceDialog"
    },
    initializeView: function () {
        this.list = _state.getListByFilter("Devices");
    },
    openDeviceContainer: function (e) {
        e.preventDefault();
        _state.listboards.getCurrentListboard().addContainer({
            "filter": this.list.getFilter(),
            "order": 0, //TODO: manage order
            "title": this.list.get('label'),
            "type": 4
        }, {wait: true, success: function (container) {
            _state.listboards.setCurrentContainer(container.get('_id'));
        }});
        //Hides the dropdown
        this.$('[data-toggle="dropdown"]').parent().removeClass('open');
    },
    newDeviceDialog: function (e) {
        e.preventDefault();
    }
});
module.exports = Import;
