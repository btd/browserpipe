var AppModel = require('models/model');

module.exports = Container = AppModel.extend({
    initialize: function (spec) {
        this.loadItems();
        /*var _state = require('models/state');
        this.list = _state.getListByFilter(this.get('filter'));
        //If the list changes its filter, container has to be updated
        this.listenTo(this.list, 'change:path', function (filter, oldFilter) {
            this.save({filter: self.list.getFilter()});
        });
        this.listenTo(this.list, 'change:label', function (filter, oldFilter) {
            this.save({title: self.list.get('label'), filter: self.list.getFilter()});
        });*/
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
        if (!this.items) {
            this.loadItems();
        }
        return this.items;
    },
    addItem: function (item) {
        var items = this.getItems();
        this.items.add(item);
    }
});
