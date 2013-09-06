var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Container = require('views/center/container/container');

var LaterContainer = Container.extend({
    initializeView: function (options) {
    	Container.prototype.initializeView.call(this, options);  
    }
});
module.exports = LaterContainer;
