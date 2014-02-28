var _state = require('../state'),
  page = require('page');

var $iframe = $('#page-section .page-content');

exports.open = function(itemId, url) {
  var url = '/html-item/' + itemId + '?url=' + encodeURIComponent(url); 
  if($iframe[0].src !== url) {
    $iframe[0].src = url;
    $iframe.off();
    $iframe.load(function() {
      var $body = $('#page-section .page-content').contents().find('body');
      $('a', $body).click(function(e) {
	e.preventDefault();
	var url = $(e.target).attr('href').trim();
	_state.serverAddItemToItem(_state.selected.parent, { type: 0, url: url }, function(item) {
	  //TODO: navigation to the just added container is not working because websockets is taking more time to add it than ajax reponse.
	  //We should fix this by sending crud request to server via websockets instead of ajax.
	  setTimeout(function() {
	    page('/item/' + item._id);
	  }, 500);
	});
      });
    });
  }
};
