define([
  'jQuery',
  'underscore',
  'backbone',
  'views/center/container/tag.container'
], function($, _, Backbone, TagContainer){  
  var SearchContainer = TagContainer.extend({
  	icon: 'img/search.png' 
  });
  return SearchContainer;
});