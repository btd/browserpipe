/*var $ = require('jquery');
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
        this.listenTo(_state.listboards, 'currentContainerChange', this.currentContainerChanged);
    },
    currentContainerChanged: function (container) {
        var $box = this.$('#search-box');
        var query = ""
        if (container) {
            var filter = container.list.getFilter();
            switch (container.get('type')) {
                case 1: //List
                    //Replaces "Lists/" with "#""
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
        //If search valid, creates a list for the search and adds a container
        if (query != "") {
            //TODO: perform the real search
            var list = _state.getListByFilter("Search/" + query);
            if (list)
                this.createContainer(list);
            else
                this.createListAndContainer(query);
        }
    },
    createListAndContainer: function (query) {
        var self = this;
        var parentList = _state.getListByFilter("Search");
        parentList.children.createList({
            label: query,
            path: parentList.getFilter()
        }, {wait: true, success: function (list) {
            self.trigger("listAdded", list);
            //We have to call it to make sure it is set before creating the container
            _state.addList(list);
            self.createContainer(list);
        }})
    },
    createContainer: function (list) {
        var container = _state.listboards.getCurrentListboard().addContainer({
            "filter": list.getFilter(),
            "order": 0, //TODO: manage order
            "title": list.get('label'),
            "type": 2
        }, {wait: true, success: function (container) {
            _state.listboards.setCurrentContainer(container.get('_id'));
        }});
    }
});
module.exports = Search;
*/