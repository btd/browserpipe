var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var AppView = require('views/view');

var Center = AppView.extend({
    calculateHeight: function () {
        //Calculates the height of the listboard
        var wheight = $(window).height();
        var topBarHeight = $('#top-bar').height();
        var bottomBarHeight = $('#bottom-bar').height();
        $('#main-container').css({
            'margin-top': topBarHeight,
            'margin-bottom': bottomBarHeight
        });
        var height = wheight - topBarHeight - bottomBarHeight;
        if (height < config.LISTBOARD_MIN_HEIGHT)
            height = config.LISTBOARD_MIN_HEIGHT;
        this.$el.height(height);
    },
    postRender: function () {
        var self = this;
        this.calculateHeight();
        //If window size changes, height is recalculated
        $(window).resize(function () {
            self.calculateHeight();
        });
    }
});
module.exports = Center;
