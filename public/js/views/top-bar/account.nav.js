var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var AppView = require('views/view');

var AccountNav = AppView.extend({
    el: "#account-nav",
    events: {
        "click .dropdown-menu a": "navigateToSection"
    },
    initializeView: function () {
    },
    navigateToSection: function (e) {
        var $target = $(e.currentTarget);
        var url = $target.attr('href');
        if (url != "/logout") {
            e.preventDefault();
            Backbone.history.navigate(url, {trigger: true});
        }
    }
});
module.exports = AccountNav;
