var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var AppView = require('views/view');
var template = require('templates/browser/browser');

var Browser = AppView.extend({
    tagName: 'div',
    attributes: function () {
        return {
            id: 'browser'
        }
    },
    initializeView: function (options) {
    },
    renderView: function () {        
        var compiledTemplate = _.template(template, {
        });
        this.$el.html(compiledTemplate);
        $('#main-container-inner').empty();
        $('#main-container-inner').append(this.$el);
        /* var self = this;
        _.map(this.model.containers.models, function (container) {
            self.addContainer(container);
        });*/
        return this;
    }
});
module.exports = Browser;
