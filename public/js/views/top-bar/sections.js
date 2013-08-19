var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var AppView = require('views/view');

var Sections = AppView.extend({
    el: "#section-selector",
    events: {
        "click .nav-option": "navigateToSection"
    },
    initializeView: function () {        
    },
    navigateToSection: function (e) {        
        var $target = $('a', e.currentTarget);
        e.preventDefault();
        var section = $target.attr('href');
        Backbone.history.navigate($target.attr('href'), {trigger: true});
    },
    unSelectSelectors: function(){
        this.$('.nav-option a').removeClass('selected');
    },
    selectSelector: function(section){
        this.unSelectSelectors();
        this.$('.nav-option#selector-' + section + ' a').addClass('selected');
    }
});
module.exports = Sections;
