var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var ListContainer = require('views/center/container/list.container');
var BrowserContainer = Container.extend({
    initializeView: function (options) {
        ListContainer.prototype.initializeView.call(this);
    }
});
module.exports = BrowserContainer;
