var List = require('models/list'),
    Backbone = require('backbone'),
    $ = require('jquery');

module.exports = ListCollection = Backbone.Collection.extend({
    model: List,
    url: "/lists",
    createList: function (model) {
        var self = this;
        var defer = $.Deferred();
        this.create(model, {
            success: function (list) {
                defer.resolve(list);
                self.trigger("created", list);
            }
        });
        return defer; //We return a deferred
    }
});