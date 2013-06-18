var AppModel = require('models/model');


module.exports = Container = AppModel.extend({
    initialize: function (spec) {
        var _state = require('models/state');
        this.tag = _state.getTagByFilter(this.get('filter'));
        //If the tag changes its filter, container has to be updated
        this.listenTo(this.tag, 'change:path', function (filter, oldFilter) {
            this.save({filter: self.tag.getFilter()});
        });
        this.listenTo(this.tag, 'change:label', function (filter, oldFilter) {
            this.save({title: self.tag.get('label'), filter: self.tag.getFilter()});
        });
    }
});
