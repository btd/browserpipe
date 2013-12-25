var _state = require('../state');

module.exports = function (socket) {

    socket.on('update.user', function (user) {
        _state.laterListboard = user.laterListboard;
        _state.browserListboards = user.browserListboards;
    });

};