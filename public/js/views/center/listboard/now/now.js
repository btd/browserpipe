var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var SectionListboard = require('views/center/listboard/section.listboard');
var NowContainer = require('views/center/container/now.container');
var template = require('templates/section/now');

var Now = SectionListboard.extend({
    attributes: {
        id: 'now'
    },
    initializeView: function (options) {

        this.template = template;
        this.collection = _state.nowListboards;

        SectionListboard.prototype.initializeView.call(this, options);
    },
    createContainerView: function(container) {
        return new NowContainer({model: container});
    }
});
module.exports = Now;
