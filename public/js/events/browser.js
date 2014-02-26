var _state = require('../state'),
  page = require('page'),
  websocket = require('../websocket/websocket');

module.exports = function(socket) {

  socket.on('browser.set.html', function(html) {
    var iframe = $('#page-section .page-content')[0];
    //well it is horrible
    iframe.src = 'javascript:vold(0)';
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
    /*$('a', $body).click(function(e) {
      e.preventDefault();
      var url = $(e.target).attr('href').trim();
      _state.serverAddItemToItem(_state.selected.parent, { type: 0, url: url }, function(item) {
        //TODO: navigation to the just added container is not working because websockets is taking more time to add it than ajax reponse.
        //We should fix this by sending crud request to server via websockets instead of ajax.
        setTimeout(function() {
          page('/item/' + item._id);
        }, 500);
      });
    });*/
  });

};
