var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var ListContainer = require('views/center/container/list.container');
var SearchContainer = ListContainer.extend({
    icon: 'img/search.png'
});
module.exports = SearchContainer;
