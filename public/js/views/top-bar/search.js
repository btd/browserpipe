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
 var filter = container.folder.getFilter();
 switch (container.get('type')) {
 case 1: //Folder
 //Replaces "Folders/" with "#""
 if (filter == "Trash")
 query = "#"
 else
 query = "#" + filter.substring(6);
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
 //If search valid, creates a folder for the search and adds a container
 if (query != "") {
 //TODO: perform the real search
 var folder = _state.getFolderByFilter("Search/" + query);
 if (folder)
 this.createContainer(folder);
 else
 this.createFolderAndContainer(query);
 }
 },
 createFolderAndContainer: function (query) {
 var self = this;
 var parentFolder = _state.getFolderByFilter("Search");
 parentFolder.children.createFolder({
 label: query,
 path: parentFolder.getFilter()
 }, {wait: true, success: function (folder) {
 self.trigger("folderAdded", folder);
 //We have to call it to make sure it is set before creating the container
 _state.addFolder(folder);
 self.createContainer(folder);
 }})
 },
 createContainer: function (folder) {
 var container = _state.listboards.getCurrentListboard().addContainer({
 "filter": folder.getFilter(),
 "order": 0, //TODO: manage order
 "title": folder.get('label'),
 "type": 2
 }, {wait: true, success: function (container) {
 _state.listboards.setCurrentContainer(container.get('_id'));
 }});
 }
 });
 module.exports = Search;
 */