var Item = require('models/item'),
    Backbone = require('backbone');

module.exports = ItemCollection = Backbone.Collection.extend({
    model: Item,
    url: "/items"
});