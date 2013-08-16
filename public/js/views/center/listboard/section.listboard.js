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
    calculateWidth: function () {                  
        var windowWidth = $(window).width();  
        var width =  windowWidth - (2 * config.SECTION_COLLAPSED_WIDTH) - 7;                
        this.$el.width(width);
        var containersWidth = this.containersViews.length * config.CONTAINER_WIDTH + config.CONTAINER_HORIZONTAL_MARGIN;;
        this.$('.containers-inner').width(containersWidth)
    },
    calculateHeight: function (height) {
        this.$el.height(height);
        this.$('.section-selector').width(height - 26);        
        for (index in this.containersViews)
            this.containersViews[index].calculateHeight(height);

        /*//Calculates the height of the listboard
        var wheight = $(window).height();
        var topBarHeight = $('#top-bar').height();
        var bottomBarHeight = $('#bottom-bar').height();
        var subBarHeight = $('#sub-bar').height();
        $('#main-container').css({
            'margin-top': topBarHeight,
            'margin-bottom': bottomBarHeight
        });
        var height = wheight - topBarHeight - bottomBarHeight - subBarHeight;
        if (height < config.LISTBOARD_MIN_HEIGHT)
            height = config.LISTBOARD_MIN_HEIGHT;
        this.$el.height(height);               
        //Calculates the height of each container view
        if(this.collapsed)
            this.$el.css({'top': topBarHeight, 'padding-top': topBarHeight});
        else
            for (index in this.containersViews)
                this.containersViews[index].calculateHeight(height);     */   
    },
    calculateHeightAndWidth: function() {
        //We first calculate the width because of the scrollbar
        //this.calculateWidth();
        //We then calculate the heights
        //this.calculateHeight();        
    },
    postRender: function () {
        
        //this.calculateWidth();
        /*var self = this;
        this.calculateHeightAndWidth();
        //If window size changes, height is recalculated
        $(window).resize(function () {
            self.calculateHeightAndWidth();
        });
        $("#bottom-bar").on("heightChanged", function () {
            self.calculateHeightAndWidth();
        });*/
    }
});
module.exports = SectionListboard;
