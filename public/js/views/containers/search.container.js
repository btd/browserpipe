define([
  'jQuery',
  'underscore',
  'backbone',
  'views/containers/container'
], function($, _, Backbone, Container){  
  var SearchContainer = Container.extend({
    name: 'SearchContainer',
  	icon: 'img/search.png' 
  });
  return SearchContainer;
});