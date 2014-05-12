db.items.find().forEach(function(i) {
  db.items.update(i, {
    $set : {
      'archiveParent' : i.parent
    },
    $unset : {
      'parent' : ""
    }
  });
});
