var AppModel = require('models/model'),
    ItemCollection = require('collections/items'),
    TagCollection = require('collections/tags');

module.exports = Tag = AppModel.extend({
    urlRoot: "/tags",
    defaults: {
    },
    initialize: function (spec) {
        //We set them as direct attributes so we do send the children attribute when saving a tag
        this.children = new TagCollection();
        //If filter changes, it updates children and triggers filterChanged event
        this.listenTo(this, 'change', function () {
            if (this.hasChanged('label') || this.hasChanged('path')) {
                var newFilter = this.getFilter();
                var oldFilter = (this.previous('path') === "" ? "" : this.previous('path') + "/") + this.previous('label');
                //Updates children
                //TODO: we should not send so many updates to the server, mongodb must do a bunch update
                var children = this.children.models;
                for (index in children)
                    children[index].save({'path': newFilter});
                //Triggers filter changed
                this.trigger('filterChanged', newFilter, oldFilter);
            }
        })
    },
    getFilter: function () {
        return (this.get('path') === "" ? "" : this.get('path') + "/") + this.get('label');
    },
    isUserTag: function () {
        return this.getFilter().substring(0, 5) === "Tags/";
    },
    addChildren: function (children) {
        this.children.add(children);
    },
    getItems: function () {
        //Check if children are not loaded at init
        if (!this.items) {
            var _state = require('models/state')
            var items = _state.getItemsByFilter(this.getFilter());
            this.items = new ItemCollection(items);
        }
        return this.items;
    },
    addItem: function (item) {
        var items = this.getItems();
        items.add(item);
    }
});
