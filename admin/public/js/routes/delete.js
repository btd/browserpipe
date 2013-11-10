// Generated by CoffeeScript 1.6.3
(function() {
  define(["smog/server", "smog/notify"], function(server, notify) {
    return {
      show: function(_arg) {
        var id, name, nativeId, q;
        name = _arg.name, id = _arg.id, nativeId = _arg.nativeId;
        if (nativeId === 'true') {
          q = '{"_id": new ObjectID("' + id + '")}';
        } else {
          q = '{"_id": "' + id + '"}';
        }
        console.log(q);
        return server.collection({
          collection: name,
          type: 'delete',
          query: q
        }, function(err) {
          if (err != null) {
            return notify.error("Error deleting document: " + (err.err || err));
          }
          notify.success("Document deleted");
          return window.location.hash = "#/collection/" + name;
        });
      }
    };
  });

}).call(this);