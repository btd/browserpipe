var AppModel = require('models/model');

module.exports = Container = AppModel.extend({
    initialize: function (spec) {
        var _state = require('models/state');
        this.list = _state.getListByFilter(this.get('filter'));
        //If the list changes its filter, container has to be updated
        this.listenTo(this.list, 'change:path', function (filter, oldFilter) {
            this.save({filter: self.list.getFilter()});
        });
        this.listenTo(this.list, 'change:label', function (filter, oldFilter) {
            this.save({title: self.list.get('label'), filter: self.list.getFilter()});
        });
    }
});
