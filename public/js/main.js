// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  baseUrl: '/js',
  paths: {
    jQuery: 'libs/jquery/jquery-1.8.0.min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    text: 'libs/require/text',
    templates: '../templates',
    bootstrap: 'libs/bootstrap/bootstrap.min',
    jquery_ui: 'libs/jquery.ui/jquery-ui-1.9.1.custom.min',
    typeahead: 'libs/typeahead/typeahead'
  },
  shim: {
      'backbone': {
          deps: ['underscore', 'jQuery'],
          exports: 'Backbone'
      },
      'underscore': {
          exports: "_"
      },
      'jQuery': {
          exports: "jQuery"
      },
      'jquery_ui': ['jQuery'],
      'typeahead': ['bootstrap']      
  }
});

require([
  // Load our app module and pass it to our definition function
  'app',
  // Some plugins have to be loaded in order due to their non AMD compliance
  'jquery_ui',
  // Because these scripts are not "modules" they do not pass any values to the definition function below
], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});
