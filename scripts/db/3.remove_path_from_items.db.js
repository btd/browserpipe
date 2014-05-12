db.items.update({}, { $unset: { path: '' } }, { multi: true });
