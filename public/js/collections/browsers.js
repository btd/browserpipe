var Browser = require('models/browser'),
    Backbone = require('backbone');

module.exports = BrowserCollection = Backbone.Collection.extend({
    model: Browser
});