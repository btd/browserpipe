var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Center = require('views/center/center');
var template = require('templates/settings/settings');

var Settings = Center.extend({
    tagName: 'div',
    attributes: function () {
        return {
            id: 'settings',
            class: 'hide'
        }
    },
    initializeView: function (options) {
    },
    renderView: function () {
        var compiledTemplate = _.template(template, {
        });
        this.$el.html(compiledTemplate);
        $('#main-container').append(this.$el);
        return this;
    }
});
module.exports = Settings;
