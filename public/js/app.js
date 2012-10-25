// Filename: app.js
define([
  'jQuery',
  'underscore',
  'backbone',
  'router', // Request router.js
  'bootstrap' //Inclulded it one time, as it is global
], function($, _, Backbone, Router){
  var initialize = function(){   
    
    // Pass in our Router module and call it's initialize function
    Router.initialize();

  }
  return {
    initialize: initialize
  };
});

