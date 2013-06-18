var AppModel = require('models/model'),
    Containers = require('collections/containers');

module.exports = Dashboard = AppModel.extend({
    urlRoot: "/dashboards",
    defaults: {
    },
    initialize: function (options) {
        //because we load it with json
        this.unset('containers');

        this.containers = new Containers(options.containers);        
        this.containers.url = this.url() + this.containers.url;
    },
    addContainer: function (container, options) {
        return this.containers.create(container, options);
    },
    removeContainer: function (container) {
        container.destroy(); // this also remove from collection
    }
});
