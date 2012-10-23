define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var Folder = Backbone.Model.extend({
    defaults: {
      selected: false
    },
    initialize: function(spec){
      //spect contains the arguments passed in the constructor

      /*this.set({
        htmlId: 'movie_' + this.cid
      })*/
    },
    validate: function (attrs) {
        if (attrs.label) {
            if (!_.isString(attrs.label) || attrs.label === 0 ) {
                return "Folder label must be a string with a length";
            }
        }
    }
  });
  return Folder;
});


/*

folder = new Folder();

folder.set({
title: "The Matrix",
format: "dvd'
});


folder.get('title');

folder = new Folder({
    title: "The Matrix",
    format: "dvd'
});
*/
