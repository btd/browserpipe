/*var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var AppView = require('views/view');
var SearchContainer = require('views/center/container/search.container');
var UserListContainer = require('views/center/container/user.list.container');
var ImportContainer = require('views/center/container/import.list.container');
var BrowserContainer = require('views/center/container/browser.list.container');
var TrashContainer = require('views/center/container/trash.list.container');
var Listboard = AppView.extend({
    tagName: 'div',
    events: {
        "click": "listboardClicked"
    },
    attributes: function () {
        return {
            class: 'listboard',
            id: "dash" + this.model.get('_id')
        }
    },
    initializeView: function (options) {
        var self = this;
        this.containersViews = new Array();
        //A new container is added
        this.listenTo(this.model.containers, 'add', function (container) {
            self.addContainer(container)
        });
        //An existing container is removed
        this.listenTo(this.model.containers, 'remove', function (container) {
            self.removeContainer(container)
        });
    },
    renderView: function () {
        //Renders each container in the listboard
        var self = this;
        _.map(this.model.containers.models, function (container) {
            self.addContainer(container);
        });
        return this;
    },
    listboardClicked: function (e) {
        //When clicking empty areas in the listboard, it unselects the current container
        var $sender = $(e.target);
        //Check if sender is not inside the container element, but an empty area
        //We also check that is not the container itself or the container-list-icon that forces rerender
        if (!$sender.parents('.container').length > 0 && !$sender.hasClass("container-list-icon") && !$sender.hasClass("container"))
            _state.listboards.setCurrentContainer(null);
    },
    addContainer: function (container) {
        //Creates a view for the container depending on the type
        var cv;
        switch (container.get('type')) {
            case 1:
                cv = new UserListContainer({model: container});
                break;
            case 2:
                cv = new SearchContainer({model: container});
                break;
            case 3:
                cv = new ImportContainer({model: container});
                break;
            case 4:
                cv = new DeviceContainer({model: container});
                break;
            case 5:
                cv = new TrashContainer({model: container});
                break;
        }
        this.containersViews.push(cv);
        //Calculates the listboard width and height
        this.calculateWidthAndHeight();
        //Renders the view
        $(this.el).append(cv.render().el);
        //Scroll to the container to make it visible
        this.scrollToContainer(cv);
        return cv;
    },
    removeContainer: function (container) {
        //Gets the container view
        var cv = _.find(this.containersViews, function (cv) {
            return cv.model.get('_id') === container.get('_id');
        })
        //Removes the view from the list
        var index = this.containersViews.indexOf(cv);
        this.containersViews.splice(index, 1);
        //Destroy the view and removes the element
        cv.dispose();
        //Calculate width
        this.calculateWidthAndHeight();
    },
    calculateHeight: function () {
        //Calculates the height of the listboard
        var wheight = $(window).height();
        var topBarHeight = $('#top-bar').height();
        var bottomBarHeight = $('#bottom-bar').height();
        $('#main-container').css({
            'margin-top': topBarHeight,
            'margin-bottom': bottomBarHeight
        });
        var height = wheight - topBarHeight - bottomBarHeight;
        if (height < config.LISTBOARD_MIN_HEIGHT)
            height = config.LISTBOARD_MIN_HEIGHT;
        this.$el.height(height);
        //Calculates the height of each container view
        for (index in this.containersViews)
            this.containersViews[index].calculateHeight();
    },
    calculateWidthAndHeight: function () {
        var windowWidth = $(window).width();
        var width = this.containersViews.length * config.CONTAINER_WIDTH;
        var parentWidth = width + config.CONTAINER_HORIZONTAL_MARGIN;
        if (parentWidth < windowWidth) {
            this.$el.parent().width(windowWidth);
            this.$el.width(windowWidth - config.CONTAINER_HORIZONTAL_MARGIN);
        }
        else {
            this.$el.parent().width(parentWidth);
            this.$el.width(width);
        }
        //Height has to be recalculated in case the x scrollbar appears
        this.calculateHeight();
    },
    postRender: function () {
        var self = this;
        this.calculateWidthAndHeight();
        //If window size changes, height is recalculated
        $(window).resize(function () {
            self.calculateWidthAndHeight();
        });
        $("#bottom-bar").on("heightChanged", function () {
            self.calculateHeight();
        });
    },
    scrollToContainer: function (container) {
        var $el = $(this.el);
        $('html, body').animate({scrollLeft: $(container.el).offset().left}, 150);
    },
    dispose: function () {
        for (index in this.containersViews)
            this.containersViews[index].dispose();
        AppView.prototype.remove.call(this);
    }
});
module.exports = Listboard;
*/