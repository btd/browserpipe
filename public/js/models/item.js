var AppModel = require('models/model');

module.exports = AppModel.extend({
    urlRoot: "/items",
    getTags: function () {
        return _.map(this.get('tags'), function (filter) {
        	//We have to declare it here because of circle reference between Item and State
        	var _state = require('models/state');
            return _state.getTagByFilter(filter);
        })
    }
});