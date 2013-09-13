var AppModel = require('models/model');

module.exports = AppModel.extend({
    urlRoot: "/items",
    initialize: function (options) {
        //forces the cid to be sent to the server
        this.set('cid', this.cid);

        //when an item is created we add it to the _state list
        var _state = require('models/state');
        _state.items.add(this);
    },
    getLists: function () {
        return _.map(this.get('lists'), function (filter) {
            //We have to declare it here because of circle reference between Item and State
            var _state = require('models/state');
            return _state.getListByFilter(filter);
        })
    }
});