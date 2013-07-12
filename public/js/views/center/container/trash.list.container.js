var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var ListContainer = require('views/center/container/list.container');
var TrashContainer = ListContainer.extend({
    initializeView: function (options) {
        ListContainer.prototype.initializeView.call(this);

        //TODO: for some reason adding menu options is not dectecting the methods
        //Add options for the menu
        /*this.addMenuOptions([
         {name: "menu_option_emptyTrash", label: "Empty Trash", method: "emptyTrash"}
         ]);  */
    },
    emptyTrash: function () {

    }
});
module.exports = TrashContainer;
