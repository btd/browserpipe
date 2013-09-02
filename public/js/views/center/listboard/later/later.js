var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var _state = require('models/state');


var SectionListboard = require('views/center/listboard/section.listboard');
var LaterContainer = require('views/center/container/later.container');
var template = require('templates/section/later');


var Later = SectionListboard.extend({
    attributes: {
        id: 'later'
    },

    initializeView: function (options) {


        this.collection = _state.laterListboards;

        this.template = template;

        // this done later because i want to set model from this.collection
        SectionListboard.prototype.initializeView.call(this, options);
    },



    createContainerView: function(container) {
        return new LaterContainer({ model: container });
    }
});
module.exports = Later;
