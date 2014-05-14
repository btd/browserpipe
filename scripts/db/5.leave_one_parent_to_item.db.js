db.items.find().forEach(function(i) {
  if(i.archiveParent)
    i.parent = i.archiveParent;
  else
    i.parent = i.browserParent;
  db.items.save(i);
});
db.items.update({}, { $unset: {browserParent: null, archiveParent: null}},{ multi: true });
