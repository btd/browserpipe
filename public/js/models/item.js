var _state = require('models/state'),
    AppModel = require('models/model');


module.exports = AppModel.extend({
    urlRoot: "/items",
    getTags: function () {

        return _.map(this.get('tags'), function (filter) {
            return _state.getTagByFilter(filter);
        })
    }
});