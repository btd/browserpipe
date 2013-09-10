var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Container = require('views/center/container/container');
var AddBookmark = require('views/dialogs/add.bookmark');

var LaterContainer = Container.extend({
    initializeView: function (options) {
    	Container.prototype.initializeView.call(this, options);  
        this.events['click .opt-add-bkmrk'] = 'addBkmrk';
    },
    addBkmrk: function () {
        var addBookmark = new AddBookmark({list: this.model.list});
        addBookmark.render();
    }
});
module.exports = LaterContainer;
