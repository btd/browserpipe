var _state = require('../state'),
  page = require('page');

var $iframe = $('#tab-section .tab-content');

var showBrowserTab = function(item) {
  _state.sidebarTab = "browser";
};

var scrollTimeout, loading = false;

exports.open = function(url) {
  loading = true;
  var self = this;
  var url = _state.selectedItem.storageUrl ? _state.selectedItem.storageUrl :
    ('/html-item/' + _state.selectedItem._id + '?url=' + encodeURIComponent(url) + '&width=' + $(window).width() + '&height=' + $(window).height());
  if($iframe[0].src !== url) {
    $iframe.hide();
    $iframe[0].src = url;
    $iframe.off();
    $iframe.load(function() {
      $iframe.show();
      var $contents = $($iframe.contents());
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
      $('a', $body).click(function(e) {
        e.preventDefault();
        var $anchor = $(e.target);
        var url = $anchor.attr('href');
        if(url) {
          var target = $anchor.attr('target');
          if(e.ctrlKey) {
            self.createInBrowser(
              _state.selectedItem._id,
              url.trim(),
              showBrowserTab
            );
          }
          else if(target && target.trim() === '_blank')
            self.createAndOpenInBrowser(_state.selectedItem._id, url.trim());
          else
            self.createAndOpenInBrowser((_state.selectedItem.browserParent? _state.selectedItem.browserParent : _state.browser._id), url.trim(), _state.selectedItem._id);
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

exports.createInBrowser = function(parentId, url, callback) {
  _state.serverAddItemToBrowser(parentId, { type: 0, url: url }, function(item) {
    if(callback) callback(item);
  });
}

exports.createAndOpenInBrowser = function(parentId, url, previousId) {
  _state.serverAddItemToBrowser(parentId, { type: 0, url: url, previous: previousId}, function(item) {
    //TODO: navigation to the just added container is not working because websockets is taking more time to add it than ajax reponse.
    //We should fix this by sending crud request to server via websockets instead of ajax.
    setTimeout(function() {
      page('/item/' + item._id);
    }, 1000);
  });
}
