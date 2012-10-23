define([
  'underscore',
  'backbone',
  'models/folder'
], function(_, Backbone, Folder){
  var FolderCollection = Backbone.Collection.extend({
    model: Folder,    
    url: "/folders",
    initialize: function(){
    },
    changeSelected: function( model, val, options){
    }

  });
  return FolderCollection;
});


/*

var tree = new FolderTree();


// you can add stuff by creating the model first
var dumb_and_dumber = new Folder({
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

/*var folder1 = new Folder({"label": "Folder1"});
      folders.add(folder1);
      folder1.save();
      var folder2 = new Folder({"label": "Folder2"});
      folders.add(folder2);
      folder2.save();
      var folder3 = new Folder({"label": "Folder3"});
      folders.add(folder3);
      folder3.save();*/