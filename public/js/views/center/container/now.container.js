var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Container = require('views/center/container/container');

var NowContainer = Container.extend({
    initializeView: function (options) {
    	Container.prototype.initializeView.call(this, options);
    }
});
module.exports = NowContainer;
