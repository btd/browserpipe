
module.exports = function (socket) {

    socket.on('browser.set.html', function (html) {
        $('#page-section .page-content').contents().find('body').html(html);
    });

};
