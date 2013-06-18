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
        this.tag = _state.getTagByFilter("Devices");
    },
    openDeviceContainer: function (e) {
        e.preventDefault();
        _state.dashboards.getCurrentDashboard().addContainer({
            "filter": this.tag.getFilter(),
            "order": 0, //TODO: manage order
            "title": this.tag.get('label'),
            "type": 4
        }, {wait: true, success: function (container) {
            _state.dashboards.setCurrentContainer(container.get('_id'));
        }});
        //Hides the dropdown
        this.$('[data-toggle="dropdown"]').parent().removeClass('open');
    },
    newDeviceDialog: function (e) {
        e.preventDefault();
    }
});
module.exports = Import;
