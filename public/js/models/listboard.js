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
        
        //When a listboard is just created, the id is set later from the server
        //We then need to update the container URL        
        if(this.get('_id'))
            this.updateContainerURL()
        else
            this.listenTo(this, 'change:_id', function () {
                this.updateContainerURL();
            }, this);
    },    
    updateContainerURL: function() {        
        this.containers.url = this.url() + this.containers.url;
    },
    addContainer: function (container, options) {
        return this.containers.create(container, options);
    },
    removeContainer: function (container, options) {
        container.destroy(options);
    }
});
