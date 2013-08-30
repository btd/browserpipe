var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var SectionListboard = require('views/center/listboard/section.listboard');
var FutureContainer = require('views/center/container/future.container');
var template = require('templates/future/future');

var Future = SectionListboard.extend({
    attributes: {
        id: 'future'
    },

    initializeView: function (options) {
        SectionListboard.prototype.initializeView.call(this, options);

        this.template = template;

        if(_state.futureListboards.length > 0)
            this.model = _state.futureListboards.at(0);
    },

    createContainerView: function(container) {
        return new FutureContainer({model: container});
    }
});
module.exports = Future;
