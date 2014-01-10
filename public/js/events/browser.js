var _state = require('../state');

module.exports = function (socket) {

    socket.on('html', function (html) {
console.log(html);
        $('.browser-content').html(html);
    });

};
