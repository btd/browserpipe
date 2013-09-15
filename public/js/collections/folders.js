var Folder = require('models/folder'),
    Backbone = require('backbone'),
    $ = require('jquery');

module.exports = FolderCollection = Backbone.Collection.extend({
    model: Folder,
    url: "/folders",
    createFolder: function (model) {
        var self = this;
        var defer = $.Deferred();
        this.create(model, {
            success: function (folder) {
                defer.resolve(folder);
                self.trigger("created", folder);
            }
        });
        return defer; //We return a deferred
    }
});