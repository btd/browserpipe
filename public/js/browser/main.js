var _state = require('../state'),
  page = require('page');

var $iframe = $('#page-section .page-content');

exports.open = function(url) {
  var self = this;
  var url = '/html-item/' + _state.selected._id + '?url=' + encodeURIComponent(url);
  if($iframe[0].src !== url) {
    $iframe[0].src = url;
    $iframe.off();
    $iframe.load(function() {
      var $body = $('#page-section .page-content').contents().find('body');
      $('a', $body).click(function(e) {
        e.preventDefault();
	var $anchor = $(e.target);
        var url = $anchor.attr('href');
	if (url) {
          var target = $anchor.attr('target');
	  if(target && target.trim() === '_blank')
	    self.createAndOpen(_state.selected.parent, url.trim());
	  else
	    self.createAndOpen(_state.selected.parent, url.trim(), _state.selected._id, _state.selected.order);
        }
      });
    });
  }
};

exports.createAndOpen = function(parentId, url, previousId, order) {
  _state.serverAddItemToItem(parentId, { type: 0, url: url, previous: previousId, order: order}, function(item) {
    //TODO: navigation to the just added container is not working because websockets is taking more time to add it than ajax reponse.
    //We should fix this by sending crud request to server via websockets instead of ajax.
    setTimeout(function() {
      page('/item/' + item._id);
    }, 500);
  });
}
