var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var AppView = require('views/view');

var Sections = AppView.extend({
    el: "#section-selector",
    events: {
        "click .nav-option": "navigateTo"
    },
    initializeView: function () {        
    },
    navigateTo: function (e) {        
        var $target = $('a', e.currentTarget);
        e.preventDefault();
        var section = $target.attr('href');
        Backbone.history.navigate(section, {trigger: true});
    }
});
module.exports = Sections;
