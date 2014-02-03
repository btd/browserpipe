var _state = require('../state');

module.exports = function (socket) {

    socket.on('browser.set.html', function (html) {
        $('#browser-section .browser-content').contents().find('body').html(html);
    });

};
