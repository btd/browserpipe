var _state = require('../state'),
  page = require('page');

var $iframe = $('#tab-section .tab-content');

var scrollTimeout, loading = false;

exports.open = function(url) {
  loading = true;
  var self = this;
  var url = _state.selectedItem.storageUrl ? _state.selectedItem.storageUrl :
    ('/html-item/' + _state.selectedItem._id + '?url=' + encodeURIComponent(url) + '&width=' + $(window).width() + '&height=' + $(window).height());
  if($iframe[0].src !== url) {
    $iframe.hide();
    var $contents = $($iframe.contents());
    $contents.find('body').html('');
    $iframe.show();
    $iframe[0].src = url;
    $iframe.off();
    $iframe.load(function() {
      var $body = $contents.find('body');
      $contents.scroll(function() {//TODO use lodash.debounce
        var scrollX = $contents.scrollLeft();
        var scrollY = $contents.scrollTop();
        if(!loading && (_state.selectedItem.scrollX !== scrollX || _state.selectedItem.scrollY !== scrollY)) {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(function() {
            _state.serverUpdateItem({
              _id: _state.selectedItem._id,
              scrollX: scrollX,
              scrollY: scrollY
            });
          }, 250);
        }
      });
      if(_state.selectedItem.scrollX)
        $contents.scrollLeft(_state.selectedItem.scrollX);
      if(_state.selectedItem.scrollY)
        $contents.scrollTop(_state.selectedItem.scrollY);
      loading = false;
    });
  }
};

exports.createAndOpen = function(parentId, url, callback) {
  _state.serverAddItem(parentId, { type: 0, url: url }, function(item) {
    //TODO: navigation to the just added container is not working because websockets is taking more time to add it than ajax reponse.
    //We should fix this by sending crud request to server via websockets instead of ajax.
    setTimeout(function() {
      page('/item/' + item._id);
      if(callback) callback(item);
    }, 1000);
  });
}
