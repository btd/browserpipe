var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var SectionListboard = require('views/center/listboard/section.listboard');
var NowContainer = require('views/center/container/now.container');
var template = require('templates/now/now');

var Now = SectionListboard.extend({
    attributes: function () {
        return {
            id: 'now'

        }
    },
    initializeView: function (options) {
        SectionListboard.prototype.initializeView.call(this, options);
        this.template = template;
        if(_state.nowListboards.length > 0)
            this.model = _state.nowListboards.at(0);        
        this.containersViews = new Array();
    },
    createContainerView: function(container) {
        return new NowContainer({model: container});
    }
});
module.exports = Now;
