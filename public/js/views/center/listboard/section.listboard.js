var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var config = require('config');
var _state = require('models/state');

var AppView = require('views/view');

var Container = require('models/container');

var ListboardDialog = require('views/dialogs/edit.listboard');

var listboardSelectItemTemplate = _.template(require('templates/section/listboard.select.item'));

var SectionListboard = AppView.extend({
    tagName: 'section',
    initializeView: function (options) {
        this.events = _.merge(this.events || {}, {
            'click .selector-label': 'clickedSelector',
            'click .selector-icon': 'clickedSelector',
            'click .add-container': 'addContainer',
            'click .js-create-listboard': 'createNewListboard',
            'click .js-listboard-select-item': 'selectCurrentListboard',
            'click .edit-listboard': 'editCurrentListboard'
        });

        if (!this.collection) throw "child view should set this.collection";
        if (!this.template) throw "child view should set this.template"; //TODO combine them to one

        // TODO compile all templates
        this.containersViews = [];

        this.listboardEditorModal = (new ListboardDialog()).render();
        this.listboardEditorModal.collection = this.collection;

        this.collection.on('currentListboardChange', function (listboard) {
            this.model = listboard;
            this.loadModelEvents();
            this.clear().renderListboard();
        }, this);

        this.collection.on('add', function (listboard) {
            this.addListboardSelectorItem(listboard);
        }, this);

        this.collection.on('change:label', function (listboard) {
            if (this.model.id === listboard.id) {
                //update label
                this.renderLabel(this.model);
            }

            this.$('.js-selector-listboards .js-listboard-select-item[data-id="' + listboard.id + '"]').html(listboard.get('label'));
        }, this);

        this.collection.on('remove', function (listboard) {
            if (this.model.id === listboard.id) {
                // current listboard deleted need switch to next
                this.collection.setCurrentListboard(this.collection.at(0));
            }

            this.$('.js-selector-listboards .js-listboard-select-item[data-id="' + listboard.id + '"]').remove();
        }, this);

        if (this.collection.length > 0) {
            this.model = this.collection.at(0);
            this.loadModelEvents();
        }
    },

    loadModelEvents: function () {
        this.model.containers.on('add', this.containerAdded, this);
        this.model.containers.on('remove', this.containerRemoved, this);
    },

    selectCurrentListboard: function (evt) {
        var listboardId = $(evt.currentTarget).data('id');

        if (this.model && this.model.id !== listboardId) {
            this.collection.setCurrentListboard(listboardId);
        }
    },

    editCurrentListboard: function () {
        this.listboardEditorModal.model = this.model;
        this.listboardEditorModal.show();
    },

    createNewListboard: function () {
        this.listboardEditorModal.model = null;
        this.listboardEditorModal.show();
    },

    // createContainerView  defined in child - create model specified type TODO maybe enough one model? with subtype

    renderView: function () {
        this.$el.html(_.template(this.template, {}));

        if (this.collection.length > 0) {
            this.collection.forEach(this.addListboardSelectorItem, this);
        }

        this.renderListboard();

        return this;
    },

    addListboardSelectorItem: function (listboard) {
        var alreadyRenderedItems = this.$('.js-selector-listboards .js-selector-item'),
            renderedItem = $(listboardSelectItemTemplate({ listboard: listboard }));

        if (alreadyRenderedItems.length) { // > 0
            alreadyRenderedItems.last().after(renderedItem);
        } else { // = 0
            this.$('.js-selector-listboards').prepend(renderedItem);
        }
    },

    clear: function () {
        this.$('.containers-inner').empty();
        return this;
    },

    renderLabel: function (listboard) {
        // update label in selector
        listboard && this.$('.js-current-listboard-label').html(this.model.get('label'));
    },

    renderListboard: function () {
        this.renderLabel(this.model);

        //render containers
        this.model && this.model.containers.forEach(function (container) {
            this.addContainerView(this.createContainerView(container));
        }, this);

        return this;
    },

    containerAdded: function (container) {
        var cv = this.addContainerView(this.createContainerView(container));
        this.scrollToContainer(cv);
    },

    addContainerView: function (containerView) {
        containerView.on('close', this.closeContainerView, this);

        //Creates a view for the container depending on the type        
        this.containersViews.push(containerView);

        //Expand the container if necessary
        var minWidth = this.$('.containers-inner').width() + config.CONTAINER_WIDTH;
        //if(self.$('.containers-inner').width() < minWidth){
        this.$('.containers-inner').width(minWidth);
        //}

        //Renders the view  
        this.$('.containers-inner').append(containerView.render().el);
        return containerView;
    },

    scrollToContainer: function (containerView) {
        this.$('.containers').animate({ scrollLeft: containerView.$el.position().left - config.SECTION_COLLAPSED_WIDTH }, 150);
    },

    closeContainerView: function (containerView) {
        this.model.removeContainer(containerView.model);
    },

    containerRemoved: function (container) {
        var containerView = _.find(this.containersViews, function (cv) {
            return cv.model.id === container.id;
        });
        if (containerView) {
            this.containersViews = _.without(this.containersViews, containerView);
            containerView.dispose();

            //Reduce the container if necessary
            var width = this.$('.containers-inner').width() - config.CONTAINER_WIDTH;
            this.$('.containers-inner').width(width);
        }
    },

    expandSection: function (space) {
        this.$el.width(space);

        var containerWidth = space - config.SECTION_COLLAPSED_WIDTH;
        this.$('.containers').width(containerWidth);

        containerWidth = this.containersViews.length * config.CONTAINER_WIDTH;
        this.$('.containers-inner').width(containerWidth);
    },

    calculateHeight: function (height) {
        this.$el.height(height);
        this.$('.containers').height(height - config.SECTION_COLLAPSED_WIDTH);
        this.$('.selector').css({ 'height': height - 8});

        for (var index in this.containersViews)
            this.containersViews[index].calculateHeight(height);
    },


    clickedSelector: function (e) {
        e.preventDefault();

        this.trigger("clickedSelectorLink");
    }
});

module.exports = SectionListboard;
