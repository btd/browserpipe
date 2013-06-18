var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var AppView = require('views/view');
var Search = AppView.extend({
    el: $("#search-form"),
    events: {
        "click #search-btn": "search"
    },
    initializeView: function () {
        this.listenTo(_state.dashboards, 'currentContainerChange', this.currentContainerChanged);
    },
    calculateWidth: function () {

    },
    currentContainerChanged: function (container) {
        var $box = this.$('#search-box');
        var query = ""
        if (container) {
            var filter = container.tag.getFilter();
            switch (container.get('type')) {
                case 1: //Tag
                    //Replaces "Tags/" with "#""
                    if (filter == "Trash")
                        query = "#"
                    else
                        query = "#" + filter.substring(5);
                    break;
                case 2: //Search
                    //Removes "Search/"
                    query = filter.substring(7);
                    break;
                case 3: //Import
                    //Replaces "Import/" with ":import"
                    if (filter == "Import")
                        query = ":import"
                    else
                        query = ":import" + filter.substring(7);
                    break;
                case 4: //Device
                    //Replaces "Device/" with ":device"
                    if (filter == "Device")
                        query = ":device"
                    else
                        query = ":device" + filter.substring(7);
                    break;
                case 5: //Trash
                    //Replaces "Trash/" with ":device"
                    if (filter == "Trash")
                        query = ":trash"
                    else
                        query = ":trash" + filter.substring(6);
                    break;
            }
        }
        $box.val(query);
    },
    search: function (e) {
        e.preventDefault();
        var query = $.trim(this.$('#search-box').val());
        //If search valid, creates a tag for the search and adds a container
        if (query != "") {
            //TODO: perform the real search
            var tag = _state.getTagByFilter("Search/" + query);
            if (tag)
                this.createContainer(tag);
            else
                this.createTagAndContainer(query);
        }
    },
    createTagAndContainer: function (query) {
        var self = this;
        var parentTag = _state.getTagByFilter("Search");
        parentTag.children.createTag({
            label: query,
            path: parentTag.getFilter()
        }, {wait: true, success: function (tag) {
            self.trigger("tagAdded", tag);
            //We have to call it to make sure it is set before creating the container
            _state.addTag(tag);
            self.createContainer(tag);
        }})
    },
    createContainer: function (tag) {
        var container = _state.dashboards.getCurrentDashboard().addContainer({
            "filter": tag.getFilter(),
            "order": 0, //TODO: manage order
            "title": tag.get('label'),
            "type": 2
        }, {wait: true, success: function (container) {
            _state.dashboards.setCurrentContainer(container.get('_id'));
        }});
    },
    calculateWidth: function () {
        var windowWidth = $(window).width();
        var dashboardOptWidth = $("#opt-dashboards").width();
        var width = windowWidth - dashboardOptWidth - config.SEARCH_BOX_FIX_MARGIN;
        if (width < config.SEARCH_BOX_MIN_WIDTH)
            width = config.SEARCH_BOX_MIN_WIDTH;
        this.$('#search-box').width(width).show();
    },
    postRender: function () {
        var self = this;
        this.calculateWidth();
        $(window).resize(function () {
            this.$('#search-box').hide();
            self.calculateWidth();
        });
    },
});
module.exports = Search;
