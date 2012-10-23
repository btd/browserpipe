// Filename: app.js
define([
  'jQuery',
  'underscore',
  'backbone',
  'router', // Request router.js
  'bootstrap' //Inclulded it one time, as it is global
], function($, _, Backbone, Router){
  var initialize = function(){
    

    calculateHeights();
    window.onresize = function(event) {
        calculateHeights();
    };
    

    // Pass in our Router module and call it's initialize function
    Router.initialize();


  }
  return {
    initialize: initialize
  };
});


function calculateHeights(){
  var wheight = $(window).height();
  var wwidth = $(window).width();
  $(".scrollable").height(wheight - 105);        
}