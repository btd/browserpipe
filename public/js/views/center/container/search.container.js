var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var TagContainer = require('views/center/container/tag.container');
var SearchContainer = TagContainer.extend({
    icon: 'img/search.png'
});
module.exports = SearchContainer;
