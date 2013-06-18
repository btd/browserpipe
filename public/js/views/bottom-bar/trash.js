var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var AppView = require('views/view');
var Trash = AppView.extend({
    el: $("#trash-option"),
    events: {
        "click": "openTrahContainer"
    },
    initializeView: function () {
        this.tag = _state.getTagByFilter("Trash");
    },
    openTrashContainer: function (e) {
        e.preventDefault();
        _state.dashboards.getCurrentDashboard().addContainer({
            "filter": this.tag.getFilter(),
            "order": 0, //TODO: manage order
            "title": this.tag.get('label'),
            "type": 5
        }, {wait: true, success: function (container) {
            _state.dashboards.setCurrentContainer(container.get('_id'));
        }});
    }
});
module.exports = Trash;
