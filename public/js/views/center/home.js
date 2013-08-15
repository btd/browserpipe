var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var AppView = require('views/view');
var template = require('templates/home/home');

var Home = AppView.extend({
    tagName: 'div',
    attributes: function () {
        return {
            id: 'home'
        }
    },
    events: {
        "click .home-option": "navigateToOption"
    },
    initializeView: function (options) {
    },
    renderView: function () {        
        var compiledTemplate = _.template(template, {
        });
        this.$el.html(compiledTemplate);
        $('#main-container-inner').empty();
        $('#main-container-inner').append(this.$el);
        return this;
    },
    navigateToOption: function(e){
        var $target = $(e.currentTarget);
        e.preventDefault();
        Backbone.history.navigate($target.attr('href'), {trigger: true});
    }
});
module.exports = Home;
