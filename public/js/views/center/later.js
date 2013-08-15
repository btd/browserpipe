var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var AppView = require('views/view');

var Later = AppView.extend({
    tagName: 'div',
    attributes: function () {
        return {
            id: 'later'
        }
    },
    initializeView: function (options) {
    },
    renderView: function () {                
        return this;
    }
});
module.exports = Later;
