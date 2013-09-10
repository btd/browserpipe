var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var _state = require('models/state');


var SectionListboard = require('views/center/listboard/section.listboard');
var FutureContainer = require('views/center/container/future.container');
var template = require('templates/section/future');

var Future = SectionListboard.extend({
    attributes: {
        id: 'future'
    },

    initializeView: function (options) {
        this.collection = _state.futureListboards;

        this.template = template;

        SectionListboard.prototype.initializeView.call(this, options);
    },

    createContainerView: function (container) {
        return new FutureContainer({model: container});
    },

    addContainer: function () {
        this.model && this.model.addContainer(
            new Container({ type: 2, filter: 'Lists', title: '' })
        );
    }
});
module.exports = Future;
