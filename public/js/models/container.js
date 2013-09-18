var AppModel = require('models/model');

module.exports = Container = AppModel.extend({
    initialize: function (spec) {
        
        //forces the cid to be sent to the server
        this.set('cid', this.cid);

        this.loadItems();
        if(this.get('type') === 2) {
            var _state = require('models/state');
            this.folder = _state.getFolderById(this.get('folder'));
        }
    },
    loadItems: function () {
        //Check if children are not loaded at init
        if (!this.items) {
            var _state = require('models/state')            
            this.items = new ItemCollection();
            _state.loadItemsByContainer(this);
        }
        return this.items;
    },
    getItems: function () {       
        if (!this.items)
            this.loadItems();
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
