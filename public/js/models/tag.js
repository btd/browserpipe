define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var Tag = Backbone.Model.extend({
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
                return "Tag label must be a string with a length";
            }
        }
    }
  });
  return Tag;
});


/*

tag = new Tag();

tag.set({
title: "The Matrix",
format: "dvd'
});


tag.get('title');

tag = new Tag({
    title: "The Matrix",
    format: "dvd'
});
*/
