var $ = require('jquery'), _ = require('lodash'), Backbone = require('backbone');

module.exports = AppView = Backbone.View.extend({
    postRender: null,
    initialize: function (options) {
        //console.time('Initializing View');
        this.initializeView(options);
        //console.timeEnd('Initializing View');
    },
    renderView: function () {
    },
    render: function () {
        var _this = this;
        //console.time('Rendering View');
        this.renderView();
        //console.timeEnd('Rendering View');
        //Executes the postRender method once the browser gets control again and the element is attached
        if (this.postRender) {
            setTimeout(function () {
                //console.time('Post Rendering View');
                _this.postRender();
                //console.timeEnd('Post Rendering View');
            }, 0);
        }
        return this;
    },
    hide: function () {
        this.$el.addClass('hide');
    },
    show: function () {
        this.$el.removeClass('hide');
    },
    //Use to extend events
    addEvents: function (events) {
        this.delegateEvents(_.extend(_.clone(this.events || {}), events));
    },
    dispose: function () {
        // Unregister for event to stop memory leak

        //Backbone.View.prototype.dispose.apply(this, arguments);
        //TODO: check if views can be disposed like this
        _.invoke(this.views, 'dispose');
        this.remove();
        this.off();
        Backbone.View.prototype.remove.call(this);
    },
    setErrorField: function ($el, $help) {
        var $parent = $el.parents('.control-group:first');
        $help.removeClass('hide');
        $parent.addClass('error');
    },
    unSetErrorField: function ($el, $help) {
        var $parent = $el.parents('.control-group:first');
        $help.addClass('hide');
        $parent.removeClass('error');
    },
    unSetAllErrorFields: function ($el) {
        var $parent = $el.parents('.control-group:first');
        $('.help-inline', $parent).addClass('hide');
        $parent.removeClass('error');
    },
    hasErrors: function () {
        return this.$('.help-inline:not(.hide)').length > 0
    }
});