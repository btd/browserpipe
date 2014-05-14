db.users.find().forEach(function(u) {
  u.pending = u.browser;
  u.browser = null;
  db.users.save(u);
});
db.users.update({}, { $unset: {browser: null}},{ multi: true });
