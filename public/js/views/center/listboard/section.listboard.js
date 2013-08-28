var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var AppView = require('views/view');

var SectionListboard = AppView.extend({   
    tagName: 'section',
    initializeView: function (options) {          
        this.events = this.events || {};
        this.events['click .selector a'] = 'clickedSelectorLink';
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
        containerView.on('close', this.closeContainerView, this);
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
        var containerWidth = width - selectorWidth;
        this.$el.width(width);
        this.$('.containers').width(containerWidth);
        this.calculateInnterContainerWidth();
    },
    calculateInnterContainerWidth: function(){
        var innerContainerWidth = this.containersViews.length * (config.CONTAINER_WIDTH + config.CONTAINER_HORIZONTAL_MARGIN);
        this.$('.containers-inner').width(innerContainerWidth)
    },
    calculateHeight: function (height) {
        this.$el.height(height);
        this.$('.containers').height(height - config.SECTION_COLLAPSED_WIDTH);
        this.$('.selector').css({ 'height': height - 8});
        for (index in this.containersViews)
            this.containersViews[index].calculateHeight(height);  
    },
    scrollToContainer: function (containerView) {        
        this.$('.containers').animate({scrollLeft: containerView.$el.offset().left + config.CONTAINER_WIDTH}, 150);
    },
    closeContainerView: function(containerView) {
        var self = this;        
        this.model.removeContainer(containerView.model, {
            wait: true, 
            success: function () {
                self.containersViews = _.without(self.containersViews, _.findWhere(self.containersViews, {cid: containerView.cid}));
                containerView.dispose();
                self.calculateInnterContainerWidth();
            }
        });        
    },
    clickedSelectorLink: function(e){
        e.preventDefault();
        this.trigger("clickedSelectorLink");
    }
});
module.exports = SectionListboard;
