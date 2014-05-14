db.items.find({ parent: null }).forEach(function(i) {
  i.deleted = true;
  db.items.save(i);
});
