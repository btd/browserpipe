// Generated by CoffeeScript 1.6.3
(function() {
  define(["smog/server", "smog/util", "smog/notify", "smog/editor", "templates/edit", "templates/collection"], function(server, util, notify, editor, templ, collection) {
    return {
      show: function(_arg) {
        var edit, name;
        name = _arg.name;
        $('#content').html(templ({
          title: 'Find',
          id: name,
          button: 'Execute'
        }));
        edit = editor.create("" + name + "-edit-view", {
          mode: "javascript",
          wrap: 100,
          worker: false,
          value: "{\r\n\r\n}"
        });
        return $('#edit-button').click(function() {
          return server.collection({
            collection: name,
            type: 'find',
            query: edit.getText()
          }, function(err, docs) {
            if (err != null) {
              return notify.error("Error retrieving documents: " + (err.err || err));
            }
            edit.destroy();
            $('#content').html(collection({
              name: name,
              documents: util.filterDocuments(docs)
            }));
            return $('.dataPreview').click(function() {
              return $(this).toggleClass("crop");
            });
          });
        });
      }
    };
  });

}).call(this);
