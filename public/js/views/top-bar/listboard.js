var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var AppView = require('views/view');
var EditListboard = require('views/dialogs/edit.listboard');
var ListboardContainer = require('views/center/listboard');
var Listboard = AppView.extend({
    el: "#opt-listboards",
    listboardTemplate: _.template('<li class="opt-add" id="opt-dash-<%= listboard.get("_id") %>"><a tabindex="-1" href="#"><%= listboard.get("label") %></a></li>'),
    events: {
        "click #opt-add-dash": "addListboardOption",
        "click #opt-edit-dash": "editListboardOption",
        "click .opt-add": "changeListboardOption"
    },
    initializeView: function () {
        this.listenTo(this.collection, 'change', this.listboardUpdated);
        this.listenTo(this.collection, 'add', this.addListboard);
        this.listenTo(this.collection, 'remove', this.removeListboard);
        this.listenTo(this.collection, 'currentListboardChange', this.renderCurrentListboard);
    },
    renderView: function () {
        var self = this;
        this.collection.map(function (listboard) {
            self.addListboard(listboard);
        })
        this.checkCollectionSize();
        return this;
    },
    postRender: function () {
    },
    renderCurrentListboard: function (currentListboard) {
        /*if (currentListboard) {
            if (this.listboardContainerView)
                this.listboardContainerView.dispose();
           // this.$('.name').html(currentListboard.get('label'))
            this.listboardContainerView = new ListboardContainer({model: currentListboard})
            $("#main-container").html(this.listboardContainerView.render().el);
        }
        
        else {
            this.$('.name').html('<i>No listboard</i>');
        }*/
    },
    listboardUpdated: function (listboard) {
        this.$("#opt-dash-" + listboard.get("_id") + " > a").html(listboard.get('label'))
        var currentListboard = this.collection.getCurrentListboard();
        if (currentListboard.get('_id') === listboard.get('_id'))
            this.renderCurrentListboard(currentListboard);
    },
    addListboard: function (listboard) {
        var compiledTemplate = this.listboardTemplate({listboard: listboard});
        this.$(".divider:last").before(compiledTemplate)
        this.checkCollectionSize();
    },
    removeListboard: function (listboard) {
        this.$("#opt-dash-" + listboard.get("_id")).remove();
        this.checkCollectionSize();
    },
    checkCollectionSize: function () {
        if (this.collection.length == 0)
            this.$("#opt-edit-dash, .divider").hide();
        else
            this.$("#opt-edit-dash, .divider").show();
    },
    addListboardOption: function () {
        var editListboard = new EditListboard({collection: this.collection});
        editListboard.render();
        this.toggle();
    },
    editListboardOption: function () {
        var editListboard = new EditListboard({collection: this.collection, model: this.collection.getCurrentListboard()});
        editListboard.render();  
        this.toggle();   
    },
    changeListboardOption: function (event) {
        var id = event.currentTarget.id.substring(9); //removes "opt-dash-" from the id
        var listboard = this.collection.get(id);
        if (listboard) {
            this.collection.setCurrentListboard(listboard.get('_id'));
            this.toggle();
        }
    },
    toggle: function () {
        this.$(".open").removeClass("open");
    }
});
module.exports = Listboard;
