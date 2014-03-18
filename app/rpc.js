var net = require('net');
var logger = require('rufus').getLogger('app.rpc');

var fs = require('fs');

var Promise = require('bluebird');

var handlers = [];

module.exports = function(options) {
  var server = net.createServer(function(c) { //'connection' listener
    c.write('Hello, type some commands\n');

    c.on('data', function(chunk) {
      var command = chunk.toString('ascii');
      var matchedHandlers = handlers.map(function(h) {

        var m = h.regex.exec(command);
        return m ? { m: m, handler: h.handler } : null;
      }).filter(Boolean);

      function callAll(handlers, callback) {
        var current = handlers.shift();
        if(current) {
          var args = [current.m];
          var done = function() {
            done.executed = true;
            callAll(handlers, callback);
          };
          done.executed = false;
          args.push(done);
          current.handler.apply(c, args);
          //if(!done.executed) done();
        } else {
          callback();
        }
      }

      callAll(matchedHandlers, function() {
        c.write('Ok\n');
      })
    })
  });

  try {
    fs.unlinkSync(options.filename);
  } catch(e) {

  }

  server.listen(options.filename, function() { //'listening' listener
    fs.chmodSync(options.filename, options.permissions);
    logger.info('RPC server now listening for %s', options.filename);
  });
};

module.exports.add = function(regex, func) {
  handlers.push({
    regex: regex,
    handler: func
  })
};
