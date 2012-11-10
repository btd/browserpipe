/*
!!Need to remove data/tags and create this collection



define([
  'underscore',
  'backbone',
  'models/tag'
], function(_, Backbone, Tag){
  var TagCollection = Backbone.Collection.extend({
    model: Tag,    
    url: "/tags",
    initialize: function(){
    },
    changeSelected: function( model, val, options){
    }

  });
  return TagCollection;
});




var tree = new TagTree();


// you can add stuff by creating the model first
var dumb_and_dumber = new Tag({
title: "Dumb and Dumber",
format: "dvd"
});


tree.add(dumb_and_dumber);


// or even by adding the raw attributes
tree.add({
title: "The Big Lebowski",
format: "VHS"
});

*/

/*var tag1 = new Tag({"label": "Tag1"});
      tags.add(tag1);
      tag1.save();
      var tag2 = new Tag({"label": "Tag2"});
      tags.add(tag2);
      tag2.save();
      var tag3 = new Tag({"label": "Tag3"});
      tags.add(tag3);
      tag3.save();*/