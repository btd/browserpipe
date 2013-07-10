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
        this.list = _state.getListByFilter("Trash");
    },
    openTrashContainer: function (e) {
        e.preventDefault();
        _state.listboards.getCurrentListboard().addContainer({
            "filter": this.list.getFilter(),
            "order": 0, //TODO: manage order
            "title": this.list.get('label'),
            "type": 5
        }, {wait: true, success: function (container) {
            _state.listboards.setCurrentContainer(container.get('_id'));
        }});
    }
});
module.exports = Trash;
