var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var AppView = require('views/view');
var ContainerHeader = require('views/center/container/header/header');
var menuTemplate = require('templates/containers/menu');

var Container = AppView.extend({
    tagName: 'div',
    events: {
        "click": "selectContainer",
        "click .close-container" : "close",
        /*"mouseenter": "showOptionsToggle",
        "mouseleave": "hideOptionsToggle"*/
    },
    initializeView: function (options) {
    },
    attributes: function () {
        return {
            class: 'items-container',
            id: "cont_" + this.model.get('_id')
        }
    },
    clean: function () {
        $(this.el).empty();
    },
    renderView: function () {
        this            
            .renderHeader()
            .renderBox();
        return this;
    },
    renderHeader: function () {
        this.header = new ContainerHeader({model: this.model});
        $(this.el).append(this.header.render().el);
        return this;
    },
    renderBox: function () {
        $(this.el).append('<div class="box"></div>');
        return this;
    },
    postRender: function () {
        this.addEvents(this.events);
        this.calculateHeight();
    },
    calculateHeight: function (height) {
        //TODO: check why is needed to rest 30
        var value = height - 60 -(config.CONTAINER_VERTICAL_MARGIN * 2);
        $(".box", this.el).css("max-height", value);
    },
    close: function(){
        this.trigger("close", this);        
    }

});

module.exports = Container;
