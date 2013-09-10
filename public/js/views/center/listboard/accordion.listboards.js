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
        'dblclick .selector': 'doubleClickedSection'
    },

    attributes: {
        id: 'listboards',
        class: 'accordion horizontal hide'
    },

    initializeView: function (options) {
        this.nowView = new Now();
        this.laterView = new Later();
        this.futureView = new Future();

        this.nowView.on('clickedSelectorLink', function () {
            this.expandSectionFullBySectionName('now');
        }, this);
        this.laterView.on('clickedSelectorLink', function () {
            this.expandSectionFullBySectionName('later');
        }, this);
        this.futureView.on('clickedSelectorLink', function () {
            this.expandSectionFullBySectionName('future');
        }, this);
    },
    renderView: function () {
        $('#main-container').empty().append(this.$el);

        $(this.el).append(this.nowView.render().el);
        $(this.el).append(this.laterView.render().el);
        $(this.el).append(this.futureView.render().el);

        this.initializeSectionsExpantion();
        return this;
    },
    doubleClickedSection: function (e) {
        e.preventDefault();

        this.expandSectionFullBySectionName($(e.currentTarget).data('section'));
    },
    initializeSectionsExpantion: function () {
        var wwidth = $(window).width(), space, space1, space2, space3;
        if (wwidth < config.TWO_SECTION_WIDTH) { //We show one section (now)
            this.expandSectionFull(
                this.nowView,
                this.laterView,
                this.futureView
            );
        }
        else if (wwidth < config.THREE_SECTION_WIDTH) { //We show two sections (now, later)
            space = wwidth - config.SECTION_COLLAPSED_WIDTH;
            space1 = Math.floor(space / 2);
            space2 = space - space1;
            this.expandSectionsByWidth(
                this.nowView,
                space1,
                this.laterView,
                space2,
                this.futureView,
                config.SECTION_COLLAPSED_WIDTH
            );
        }
        else { //We show three sections (now, later, future)
            space = wwidth
            space1 = Math.floor(wwidth / 3);
            space2 = space1;
            space3 = space - space1 - space2;
            this.expandSectionsByWidth(
                this.nowView,
                space1,
                this.laterView,
                space2,
                this.futureView,
                space3
            );
        }
    },
    expandSectionFullBySectionName: function (section) {
        switch (section) {
            case 'now' :
                this.expandSectionFull(
                    this.nowView,
                    this.laterView,
                    this.futureView
                );
                break;
            case 'later' :
                this.expandSectionFull(
                    this.laterView,
                    this.futureView,
                    this.nowView
                );
                break;
            case 'future' :
                this.expandSectionFull(
                    this.futureView,
                    this.nowView,
                    this.laterView
                );
                break;
        }
    },
    expandSectionFull: function (expandedSection, section2, section3) {
        var wwidth = $(window).width();
        var expandedSectionSpace = wwidth - (config.SECTION_COLLAPSED_WIDTH * 2);
        this.expandSectionsByWidth(
            expandedSection,
            expandedSectionSpace,
            section2,
            config.SECTION_COLLAPSED_WIDTH,
            section3,
            config.SECTION_COLLAPSED_WIDTH
        );
    },
    expandSectionsByWidth: function (section1, width1, section2, width2, section3, width3) {
        section1.expandSection(width1);
        section2.expandSection(width2);
        section3.expandSection(width3);
    },
    dragLaterSection: function (e, ui) {
        var wwidth = $(window).width();
        var direction = ui.originalPosition.left > ui.position.left ? 'left' : 'right';
        var difference = 0;

        //Fix dragging outside the page
        if (ui.offset.left < config.SECTION_COLLAPSED_WIDTH)
            ui.offset.left = config.SECTION_COLLAPSED_WIDTH;
        if (ui.offset.left > (wwidth - (2 * config.SECTION_COLLAPSED_WIDTH)))
            ui.offset.left = wwidth - (2 * config.SECTION_COLLAPSED_WIDTH);

        //We calculate the difference of drag
        difference = ui.offset.left - this.laterView.$el.offset().left;

        if (difference !== 0) {

            //We always expand or reduce (depending on the difference) the now listboard
            this.nowView.expandSection(this.nowView.$el.outerWidth() + difference);

            //If drag to right we always reduce first later listboard and then future listboard
            if (direction === 'right' && this.laterView.$el.outerWidth() - difference < config.SECTION_COLLAPSED_WIDTH) {
                difference = difference - (this.laterView.$el.outerWidth() - config.SECTION_COLLAPSED_WIDTH);
                if (this.laterView.$el.width() != config.SECTION_COLLAPSED_WIDTH)
                    this.laterView.expandSection(config.SECTION_COLLAPSED_WIDTH);
                this.futureView.expandSection(this.futureView.$el.outerWidth() - difference);
            }
            else
                this.laterView.expandSection(this.laterView.$el.outerWidth() - difference);
        }
    },
    dragFutureSection: function (e, ui) {
        var wwidth = $(window).width();
        var direction = ui.originalPosition.left > ui.position.left ? 'left' : 'right';
        var difference = 0;

        //Fix dragging outside the page
        if (ui.offset.left < (2 * config.SECTION_COLLAPSED_WIDTH))
            ui.offset.left = (2 * config.SECTION_COLLAPSED_WIDTH);
        if (ui.offset.left > (wwidth - config.SECTION_COLLAPSED_WIDTH))
            ui.offset.left = wwidth - config.SECTION_COLLAPSED_WIDTH;

        //We calculate the difference of drag
        difference = ui.offset.left - this.futureView.$el.offset().left;

        if (difference !== 0) {

            //We always expand or reduce (depending on the difference) the future listboard            
            if (this.futureView.$el.outerWidth() - difference < config.SECTION_COLLAPSED_WIDTH)
                this.futureView.expandSection(config.SECTION_COLLAPSED_WIDTH);
            else
                this.futureView.expandSection(this.futureView.$el.outerWidth() - difference);

            //If drag to left we always reduce first later listboard and then now listboard
            if (direction === 'left' && this.laterView.$el.outerWidth() + difference < config.SECTION_COLLAPSED_WIDTH) {
                difference = (this.laterView.$el.outerWidth() - config.SECTION_COLLAPSED_WIDTH) - difference;
                if (this.laterView.$el.width() != config.SECTION_COLLAPSED_WIDTH)
                    this.laterView.expandSection(config.SECTION_COLLAPSED_WIDTH);
                this.nowView.expandSection(this.nowView.$el.outerWidth() - difference);
            }
            else
                this.laterView.expandSection(this.laterView.$el.outerWidth() + difference);
        }
    },
    calculateHeight: function () {
        //Calculates the height of the listboards accordion
        var wheight = $(window).height();
        var topBarHeight = $('#top-bar').outerHeight();
        this.$el.css({
            'margin-top': topBarHeight
        });
        var height = wheight - topBarHeight;
        this.$el.height(height);
        this.nowView.calculateHeight(height);
        this.laterView.calculateHeight(height);
        this.futureView.calculateHeight(height);
    },
    postRender: function () {
        var self = this;
        this.calculateHeight();
        //If window size changes, height is recalculated
        $(window).resize(function () {
            self.calculateHeight();
            self.initializeSectionsExpantion();
        });
        this.laterView.$el.draggable({
            handle: ".selector",
            axis: "x",
            drag: function (e, ui) {
                self.dragLaterSection(e, ui)
            }
        });
        this.futureView.$el.draggable({
            handle: ".selector",
            axis: "x",
            drag: function (e, ui) {
                self.dragFutureSection(e, ui)
            }
        });
    }
});
module.exports = AccordionListboards;
