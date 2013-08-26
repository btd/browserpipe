var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var AppView = require('views/view');

var SectionListboard = AppView.extend({   
    tagName: 'section',
    initializeView: function (options) {        
    }, 
    renderView: function () {     
        var compiledTemplate = _.template(this.template, {
            listboard_label: this.model.get('label')
        });
        this.$el.html(compiledTemplate);             
        if(this.model) {
            var self = this;
            _.map(this.model.containers.models, function (container) {
                var containerView = self.createContainerView(container);
                self.addContainerView(containerView);
            });
        }
        return this;
    },
    addContainerView: function (containerView) {
        //Creates a view for the container depending on the type        
        this.containersViews.push(containerView);        
        //Renders the view
        this.$('.containers-inner').append(containerView.render().el);
        return containerView;
    },
    selectSection: function() {
        this.$el.addClass('opened');
        this.calculateWidth();
        return this;
    },
    getSelector: function(){
        return this.$('.selector');
    },
    expandSection: function(space){   
        var width = space;                
        var selectorWidth = config.SECTION_COLLAPSED_WIDTH;        
        var innerContainerWidth = this.containersViews.length * config.CONTAINER_WIDTH + config.CONTAINER_HORIZONTAL_MARGIN;                        
        var containerWidth = width - selectorWidth;
        this.$el.width(width);
        this.$('.containers').width(containerWidth);
        this.$('.containers-inner').width(innerContainerWidth)
    },
    calculateHeight: function (height) {
        this.$el.height(height);
        this.$('.containers').height(height - config.SECTION_COLLAPSED_WIDTH);
        this.$('.selector').css({ 'height': height - 8});
        for (index in this.containersViews)
            this.containersViews[index].calculateHeight(height);  
    }
});
module.exports = SectionListboard;
