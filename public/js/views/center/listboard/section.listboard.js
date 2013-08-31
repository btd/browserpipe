var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var config = require('config');
var _state = require('models/state');

var AppView = require('views/view');

var Container = require('models/container');

var SectionListboard = AppView.extend({   
    tagName: 'section',
    initializeView: function (options) {          
        this.events = _.merge(this.events || {}, {
            'click .selector-label': 'clickedSelector',            
            'click .selector-icon': 'clickedSelector',
            'click .add-container': 'addContainer'
        });
        // child view should set this.model to listboard
        // this.template should be set for section template TODO combine them to one
        // TODO compile all templates
        this.containersViews = [];
    },

    // createContainerView  defined in child - create model specified type TODO maybe enough one model? with subtype

    renderView: function () {     
        var compiledTemplate = _.template(this.template, {
            listboard_label: this.model.get('label')
        });
        this.$el.html(compiledTemplate);

        this.model.containers.map(function (container) {
            this.addContainerView(this.createContainerView(container));
        }, this);

        return this;
    },

    addContainer: function(){
        var that = this;

        this.model.addContainer(new Container({ type: 2, filter: 'Lists', title: 'New Container' }), {
            success: function (container) {
                var cv = that.addContainerView(that.createContainerView(container));
                that.scrollToContainer(cv);
            }
        });
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

    closeContainerView: function(containerView) {
        var self = this;
        this.model.removeContainer(containerView.model, {
            success: function () {
                self.containersViews = _.without(self.containersViews, _.findWhere(self.containersViews, { cid: containerView.cid }));
                containerView.dispose();

                //Reduce the container if necessary
                var width = self.$('.containers-inner').width() - config.CONTAINER_WIDTH;
                self.$('.containers-inner').width(width);
            }
        });
    },

    expandSection: function(space){        
        this.$el.width(space);

        var containerWidth = space - config.SECTION_COLLAPSED_WIDTH;
        this.$('.containers').width(containerWidth);

        var containerWidth = this.containersViews.length * config.CONTAINER_WIDTH;
        this.$('.containers-inner').width(containerWidth);
    },

    calculateHeight: function (height) {
        this.$el.height(height);
        this.$('.containers').height(height - config.SECTION_COLLAPSED_WIDTH);
        this.$('.selector').css({ 'height': height - 8});

        for (var index in this.containersViews)
            this.containersViews[index].calculateHeight(height);  
    },


    clickedSelector: function(e){
        e.preventDefault();

        this.trigger("clickedSelectorLink");
    }
});

module.exports = SectionListboard;
