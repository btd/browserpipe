var AppModel = require('models/model');

module.exports = AppModel.extend({
    urlRoot: "/items",
    getLists: function () {
        return _.map(this.get('lists'), function (filter) {
            //We have to declare it here because of circle reference between Item and State
            var _state = require('models/state');
            return _state.getListByFilter(filter);
        })
    }
});