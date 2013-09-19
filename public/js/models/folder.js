var AppModel = require('models/model'),
    ItemCollection = require('collections/items');

module.exports = Folder = AppModel.extend({
    urlRoot: "/folders",
    defaults: {
    },
    initialize: function (spec) {

        //forces the cid to be sent to the server
        this.set('cid', this.cid);

        //We have to declare it here because of circle reference between Folder and FolderCollection
        var FolderCollection = require('collections/folders');
        //We set them as direct attributes so we do send the children attribute when saving a folder
        this.children = new FolderCollection();        
        
    },
    getFilter: function () {
        return (this.get('path') === "" ? "" : this.get('path') + "/") + this.get('label');
    },
    getPreviousFilter: function () {
        return (this.previous('path') === "" ? "" : this.previous('path') + "/") + this.previous('label');
    },
    isUserFolder: function () {
        return this.getFilter().substring(0, 8) === "Folders/";
    },
    addChildren: function (children) {
        this.children.add(children);
    },
    removeChildren: function (children, options) {
        children.destroy(options);
    },
    getItems: function () {
        //Check if children are not loaded at init
        if (!this.items) {
            this.items = new ItemCollection();
        }
        return this.items;
    },
    addItem: function (item) {
        var items = this.getItems();
        items.add(item);
    },
    removeItem: function (itemId) {
        var items = this.getItems();
        items.remove(itemId);
    }
});
