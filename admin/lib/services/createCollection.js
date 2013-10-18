// Generated by CoffeeScript 1.6.3
(function() {
  module.exports = function(cb, name, options) {
    if (options == null) {
      options = {};
    }
    if (cb.socket.mongo == null) {
      return cb("Not connected");
    }
    if (!((name != null) && typeof name === "string" && name.length > 0)) {
      return cb("Missing name");
    }
    options.safe = true;
    return cb.socket.mongo.database.createCollection(name, options, function(err, col) {
      if (err != null) {
        return cb(err);
      }
      if (col == null) {
        return cb("Not created");
      }
      return cb();
    });
  };

}).call(this);
