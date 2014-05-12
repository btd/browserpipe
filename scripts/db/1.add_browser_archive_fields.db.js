db.users.find().forEach(function(u) {
  var item = {"title": "Browser", "items": [], "user": u._id, "type": 2, "deleted": false, "pinned": false, "createdAt": u.createdAt, "updatedAt": u.updatedAt};
  db.items.save(item);
  u.archive = u.browser;
  u.browser = item._id;
  db.users.save(u);
});
