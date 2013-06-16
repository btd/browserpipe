var Container = require('models/container'),
    Backbone = require('backbone');

module.exports = ContainerCollection = Backbone.Collection.extend({
    model: Container,
    url: "/containers"
});