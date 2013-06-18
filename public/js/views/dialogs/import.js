var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var AppView = require('views/view');
var Import = AppView.extend({
    events: {
        "shown": "shown",
        "hidden": "hidden",
        "click .opt-save": "save",
        "click .opt-cancel": "close",
        "submit .form-horizontal": "preventDefault",
        "keyup": "keypressed"
    },
    initializeView: function (options) {
    },
    renderView: function () {
        var compiledTemplate = this.prepareTemplate();
        this.$el.html(compiledTemplate).appendTo('#dialogs').modal('show');
        return this;
    },
    createTagAndContainerAndClose: function (label, parentTag) {
        var self = this;
        parentTag.children.createTag({
            label: label,
            path: parentTag.getFilter()
        }, {wait: true, success: function (tag) {
            self.trigger("tagAdded", tag);
            //We have to call it to make sure it is set before creating the container
            _state.addTag(tag);
            self.createContainerAndClose(self, tag);
        }})
    },
    createContainerAndClose: function (self, tag) {
        var container = _state.dashboards.getCurrentDashboard().addContainer({
            "filter": tag.getFilter(),
            "order": 0, //TODO: manage order
            "title": tag.get('label'),
            "type": 3
        }, {wait: true, success: function (container) {
            _state.dashboards.setCurrentContainer(container.get('_id'));
            self.close();
        }});
    },
    getCurrentTime: function () { //Eg: 2013-5-12
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        var curr_hour = d.getHours();
        var curr_minute = d.getMinutes();
        var curr_second = d.getSeconds();
        return  curr_year + "-" + curr_month + "-" + curr_date + " " + curr_hour + ":" + curr_minute + ":" + curr_second;
    },
    close: function () {
        this.$el.modal('hide');
    },
    shown: function () {
    },
    hidden: function () {
        this.dispose();
    },
    preventDefault: function (event) {
        event.preventDefault();
    },
    keypressed: function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            //If enter inside form, we submit it
            if ($(event.target).parents('.form-horizontal').length > 0) {
                $(".opt-save").click();
            }
        }
    }
});
module.exports = Import;
