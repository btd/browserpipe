/*var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var AppView = require('views/view');
var template = require('templates/lists/breadcrumb.dropdown.list');

var compiledTemplate = _.template(template);

var BreadCrumbDropdownList = AppView.extend({
    name: 'BreadCrumbDropdownList',
    tagName: 'a',
    events: {
        "mouseenter": "showChildrenOption",
        "mouseleave": "hideChildrenOption",
    },
    attributes: function () {
        return {
            class: "dropdown_list",
            id: "dropdown_list_" + this.model.get('_id')
        }
    },
    initializeView: function () {
    },
    renderView: function () {
        this.$el.html(compiledTemplate({list: this.model}));
        return this;
    },
    postRender: function () {
        //As not all browsers support HTML5, we set data attribute by Jquery
        this.$el.data('filter', this.model.getFilter());
    },
    showChildrenOption: function () {
        this.$(".children").show();
    },
    hideChildrenOption: function () {
        this.$(".children").hide();
    }
});
module.exports = BreadCrumbDropdownList;
*/