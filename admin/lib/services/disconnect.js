// Generated by CoffeeScript 1.6.3
(function() {
  module.exports = function(cb, host, port, database) {
    if (cb.socket.mongo == null) {
      return cb("Not connected");
    }
    return cb.socket.mongo.database.close(function(err) {
      if (err != null) {
        return cb(err);
      }
      cb();
      return delete cb.socket.mongo;
    });
  };

}).call(this);