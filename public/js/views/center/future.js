var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var AppView = require('views/view');

var Future = AppView.extend({
    tagName: 'div',
    attributes: function () {
        return {
            id: 'future'
        }
    },
    initializeView: function (options) {
    },
    renderView: function () {                
        return this;
    }
});
module.exports = Future;
