var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var AppView = require('views/view');
var Now = require('views/center/listboard/now/now');
var Later = require('views/center/listboard/later/later');
var Future = require('views/center/listboard/future/future');

var AccordionListboards = AppView.extend({
    tagName: 'div',
    events: {
        'click .section-selector': 'clickedSection'
    },
    attributes: function () {
        return {
            id: 'listboards',
            class: 'accordion horizontal'
        }
    },
    initializeView: function (options) {
        this.nowView = new Now();
        this.laterView = new Later();
        this.futureView = new Future();
    },
    renderView: function () {              
        $('#main-container').empty();
        $('#main-container').append(this.$el);
        $(this.el).append(this.nowView.render().el);
        $(this.el).append(this.laterView.render().el);
        $(this.el).append(this.futureView.render().el);
        this.selectSection(location.hash)   
        return this;
    },    
    clickedSection: function(e){
        this.selectSection($(e.target).attr('href'));
    },
    selectSection: function(section){     
        this.$('.opened').removeClass('opened');
        this.nowView.$el.css('width', '');
        this.laterView.$el.css('width', '');
        this.futureView.$el.css('width', '');
        switch(section){
            case '#now': this.nowView.selectSection(); break;
            case '#later': this.laterView.selectSection(); break;
            case '#future': this.futureView.selectSection(); break;
        }
    },
    calculateHeight: function () {
        //Calculates the height of the listboards accordion
        var wheight = $(window).height();
        var topBarHeight = $('#top-bar').outerHeight() - 1;
        var bottomBarHeight = $('#bottom-bar').outerHeight();
        this.$el.css({
            'margin-top': topBarHeight
        });        
        var height = wheight - topBarHeight - bottomBarHeight;
        if (height < config.LISTBOARD_MIN_HEIGHT)
            height = config.LISTBOARD_MIN_HEIGHT;
        this.$el.height(height); 

        this.nowView.calculateHeight(height - 6);
        this.laterView.calculateHeight(height - 6);
        this.futureView.calculateHeight(height - 6);
    },
    postRender: function () {
        var self = this;
        this.calculateHeight();
        //If window size changes, height is recalculated
        $(window).resize(function () {
            self.calculateHeight();
        });
        $("#bottom-bar").on("heightChanged", function () {
            self.calculateHeight();
        });
    }
});
module.exports = AccordionListboards;
