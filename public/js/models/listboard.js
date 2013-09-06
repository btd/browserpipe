var AppModel = require('models/model'),
    Containers = require('collections/containers');

module.exports = Listboard = AppModel.extend({
    urlRoot: "/listboards",
    defaults: {
    },
    initialize: function (options) {
        //because we load it with json
        this.unset('containers');

        //forces the cid to be sent to the server
        this.set('cid', this.cid);

        this.containers = new Containers(options.containers);        
        this.containers.url = this.url() + this.containers.url;
    },
    addContainer: function (container, options) {
        return this.containers.create(container, options);
    },
    removeContainer: function (container, options) {
        container.destroy(options);
    }
});
