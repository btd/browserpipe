var _state = require('../state'),
  page = require('page');

var $iframe = $('#page-section .page-content');

exports.open = function(url) {
  var self = this;
  var url = '/html-item/' + _state.selected._id + '?url=' + encodeURIComponent(url) + '&width=' + $(window).width() + '&height=' + $(window).height();
  if($iframe[0].src !== url) {
    $iframe[0].src = url;
    $iframe.off();
    $iframe.load(function() {
      var $contents = $($iframe.contents());
      var $body = $contents.find('body');
      $contents.scroll(function () { 
	clearTimeout($.data(this, 'scrollTimer'));
	$.data(this, 'scrollTimer', setTimeout(function() {
	  _state.serverUpdateItem({
	    _id: _state.selected._id,
	    scrollX: $contents.scrollLeft(),
	    scrollY: $contents.scrollTop()
	  });
	}, 250));
      });
      $('a', $body).click(function(e) {
        e.preventDefault();
	var $anchor = $(e.target);
        var url = $anchor.attr('href');
	if (url) {
          var target = $anchor.attr('target');
	  if(target && target.trim() === '_blank')
	    self.createAndOpen(_state.selected.parent, url.trim());
	  else
	    self.createAndOpen(_state.selected.parent, url.trim(), _state.selected._id);
        }
      });
      if(_state.selected.scrollX)
        $contents.scrollLeft(_state.selected.scrollX);
      if(_state.selected.scrollY)
        $contents.scrollTop(_state.selected.scrollY);
    });
  }
};

exports.createAndOpen = function(parentId, url, previousId) {
  _state.serverAddItemToItem(parentId, { type: 0, url: url, previous: previousId}, function(item) {
    //TODO: navigation to the just added container is not working because websockets is taking more time to add it than ajax reponse.
    //We should fix this by sending crud request to server via websockets instead of ajax.
    setTimeout(function() {
      page('/item/' + item._id);
    }, 1000);
  });
}
