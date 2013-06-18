var Tag = require('models/tag'),
    Backbone = require('backbone'),
    $ = require('jquery');

module.exports = TagCollection = Backbone.Collection.extend({
    model: Tag,
    url: "/tags",
    createTag: function (model) {
        var self = this;
        var defer = $.Deferred();
        this.create(model, {
            success: function (tag) {
                defer.resolve(tag);
                self.trigger("created", tag);
            }
        });
        return defer; //We return a deferred
    }
});