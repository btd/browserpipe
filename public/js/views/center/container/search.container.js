define([
  'jQuery',
  'underscore',
  'backbone',
  'views/center/container/container'
], function($, _, Backbone, Container){  
  var SearchContainer = Container.extend({
  	icon: 'img/search.png' 
  });
  return SearchContainer;
});