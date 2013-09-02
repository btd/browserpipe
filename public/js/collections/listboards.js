var Listboard = require('models/listboard'),
    Backbone = require('backbone');


var ListboardCollection = Backbone.Collection.extend({
    model: Listboard,
    url: "/listboards",
    initialize: function (models) {
        this.listenTo(this, 'remove', this.listboardRemoved);
    },
    getCurrentListboard: function () {
        return this.currentListboardId && this.get(this.currentListboardId);
    },
    getCurrentContainer: function () {
        var currentListboard = this.getCurrentListboard()
        return currentListboard && currentListboard.containers.get(this.currentContainerId);
    },
    setCurrentListboard: function (listboardId) {
        this.currentListboardId = listboardId;
        var listboard = this.get(listboardId);
        //Triggers event
        this.trigger('currentListboardChange', listboard);
        //Sets the first container as current one
        if (listboard && listboard.containers.length > 0)
            this.setCurrentContainer(listboard.containers.at(0));
        else
            this.setCurrentContainer(null);
    },
    setCurrentContainer: function (containerId) {
        this.currentContainerId = containerId;
        var currentListboard = this.getCurrentListboard();
        var container = null;
        if (currentListboard)
            container = currentListboard.containers.get(containerId)
        this.trigger('currentContainerChange', container);
    },
    listboardRemoved: function(){
        //If current listboard removed, then we load another
        if(!this.getCurrentListboard()){
            if(this.length > 0)
                this.setCurrentListboard(this.at(0).get('_id'));
            else
                this.setCurrentListboard(null);
        }
    }
});

var extendedWithTypeCollection = function(Collection, Model, t) {
    return Collection.extend({
        model: Model.extend({
            defaults: {
                type: t
            }
        })
    })
};

ListboardCollection.Future = extendedWithTypeCollection(ListboardCollection, Listboard, 2);
ListboardCollection.Later = extendedWithTypeCollection(ListboardCollection, Listboard, 1);

module.exports = ListboardCollection;

