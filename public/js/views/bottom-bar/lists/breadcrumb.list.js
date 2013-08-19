/*var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var AppView = require('views/view');
var EditList = require('views/dialogs/edit.list');
var BreadCrumbDropdownList = require('views/bottom-bar/lists/breadcrumb.dropdown.list');
var listTemplate = require('templates/lists/breadcrumb.list');

var BreadCrumbList = AppView.extend({
    tagName: 'li',
    events: {
        "mouseenter": "showDropDown",
        "mouseleave": "hideDropDown",
        "mouseenter .children": "startNavigateToChildList",
        "mouseleave .children": "stopNavigateToChildList",
        "click .item": "openListContainer",
        "click .dropdown_list": "selectChildList",
        "click .dropdown-add-list": "addListOption",
        "click .dropdown-edit-list": "editListOption"
    },
    attributes: function () {
        return {
            class: 'list-breadcrumb dropdown',
            id: "list_bread_" + this.model.get('_id')
        }
    },
    initializeView: function () {
        this.opened = this.options.opened;
        this.listenTo(this.model, 'filterChanged', this.listFilterChanged);
        this.listenTo(this.model.children, 'change reset add remove', this.renderDropDown);
    },
    renderView: function () {
        var compiledTemplate = _.template(listTemplate, {list: this.model});
        $(this.el).html(compiledTemplate);
        return this;
    },
    postRender: function () {
        var self = this;
        $(window).resize(function () {
            self.renderDropDown();
        });
        //As not all browsers support HTML5, we set data attribute by Jquery
        this.$el.data('filter', this.model.getFilter());
        if (this.opened)
            this.showDropDown();
    },
    getListFilter: function () {
        return this.model.getFilter();
    },
    showDropDown: function () {
        var $dropdownMenu = this.$(".dropdown-menu");
        $dropdownMenu.siblings('.item').addClass('selected');
        if (!this.dropDownListViews)
            this.renderDropDownView(this.$('.dropdown-menu-lists'))
        $dropdownMenu.show();
        this.trigger("showDropDown", this.getListFilter());
    },
    hideDropDown: function () {
        var $dropdownMenu = this.$(".dropdown-menu");
        $dropdownMenu.siblings('.item').removeClass('selected');
        if (this.dropDownListViews)
            $dropdownMenu.hide();
    },
    renderDropDownView: function ($dropdownMenuLists) {
        this.dropDownListViews = [];
        //Calculate max columns
        var windowWidth = $(window).width();
        var columns = Math.floor((windowWidth * 0.7) / config.DROPDOWN_COLUMN_WIDTH); //0.7 to not get all screen
        //Calculate lists per column
        var listsPerColumn = Math.ceil(this.model.children.length / columns);
        //If lists per column is less than a min, then we set the min
        if (listsPerColumn < config.MIN_DROPDOWN_LISTS_PER_COLUMN)
            listsPerColumn = config.MIN_DROPDOWN_LISTS_PER_COLUMN;
        //Best collection interation: http://jsperf.com/backbone-js-collection-iteration/5
        var columnsCount = 0;
        for (var i = 0, l = this.model.children.length; i < l; i++) {
            var $ul;
            //Add new column every time it reaches the max per column
            if (i % listsPerColumn === 0) {
                columnsCount++;
                $ul = $('<ul></ul>');
                var $oneColumn = $('<li class="one-column"></li>');
                $oneColumn.append($ul);
                $dropdownMenuLists.append($oneColumn);
            }
            var childList = this.model.children.models[i];
            var $li = $('<li></li>');
            $ul.append($li);
            var dropDownListView = new BreadCrumbDropdownList({model: childList});
            this.dropDownListViews.push(dropDownListView);
            $li.append(dropDownListView.render().el);
        }
        //Sets dropdown width
        this.setDropDownWidth(columnsCount);
        //Sets dropdown width
        this.setDropDownMaxHeight();
        //Positions the arrow
        this.setArrowPosition();
    },
    clearDropDown: function ($dropdownMenuLists) {
        $dropdownMenuLists.empty();
        _.each(this.dropDownListViews, function (dropDownListView) {
            dropDownListView.dispose();
        });
    },
    setDropDownWidth: function (columnsCount) {
        var width = columnsCount * config.DROPDOWN_COLUMN_WIDTH + 20; //20px for scrollbar
        this.$('.dropdown-menu-lists').width(width);
    },
    setDropDownMaxHeight: function () {
        var windowHeight = $(window).height();
        this.$('.dropdown-menu-lists').css({
            'max-height': Math.floor(windowHeight * 0.7)
        });
    },
    setArrowPosition: function () {
        var bodyWidth = $('body').width();
        var dropDownWidth = this.$('.dropdown-menu').width();
        var left = this.$('.dropdown-menu').parent().position().left;
        if ((left + dropDownWidth) > bodyWidth) {
            var newLeft = 1 - (dropDownWidth - (bodyWidth - left));
            this.$('.dropdown-menu').css({
                'left': newLeft
            });
            this.$('.dropdown-menu').css({
                'left': newLeft
            });
        }
    },
    startNavigateToChildList: function (e) {
        var self = this;
        var filter = $.data($(e.target).parent().get(0), 'filter');
        this.timeout = setTimeout(function () {
            //Triggers the event
            self.trigger('startNavigateToChildList', filter);
        }, 350);
    },
    stopNavigateToChildList: function () {
        clearTimeout(this.timeout);
    },
    openListContainer: function (e) {
        e.preventDefault();
        this.createContainerFromList(this.model);
    },
    selectChildList: function (e) {
        e.preventDefault();
        var filter = $.data($(e.target).get(0), 'filter');
        var list = _state.getListByFilter(filter);
        this.createContainerFromList(list);
    },
    createContainerFromList: function (list) {
        var container = _state.listboards.getCurrentListboard().addContainer({
            "filter": list.getFilter(),
            "order": 0, //TODO: manage order
            "title": list.get('label'),
            "type": 1
        }, {wait: true, success: function (container) {
            _state.listboards.setCurrentContainer(container.get('_id'));
        }});
    },
    addListOption: function () {
        var self = this;
        var editList = new EditList({model: this.model, editMode: false});
        this.listenTo(editList, 'listAdded', function (list) {
            //Create container
            self.createContainerFromList(list);
        });
        editList.render();
        this.hideDropDown();
    },
    editListOption: function () {
        var editList = new EditList({model: this.model, editMode: true});
        editList.render();
        this.hideDropDown();
    },
    listFilterChanged: function () {
        //Renders everything again
        this.render();
        this.renderDropDown();
    },
    renderDropDown: function () {
        //Renders dropdown again
        var $dropdownMenuLists = this.$(".dropdown-menu-lists");
        this.clearDropDown($dropdownMenuLists);
        this.renderDropDownView($dropdownMenuLists);
    }
});
module.exports = BreadCrumbList;
*/