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
    isUserFolder: function () {
        return this.getFilter().substring(0, 6) === "Folders/";
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
            var _state = require('models/state');
            var items = _state.getItemsByFilter(this.getFilter());
            this.items = new ItemCollection(items);
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
