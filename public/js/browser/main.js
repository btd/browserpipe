var _state = require('../state'),
  page = require('page');

var $iframe = $('#page-section .page-content');

var showNewItemMessage = function(newItem) {
  var msg = Messenger().post({
    message: "Opened link in new tab",
    hideAfter: 6,
    actions: {
      view: {
        label: "View",
        action: function() {
          page('/item/' + newItem._id);
          msg.hide()
        }
      }
    }
  });
};

var scrollTimeout, loading = false;

exports.open = function(url) {
  loading = true;
  $iframe[0].src = "about:blank";
  var self = this;
  var url = _state.selected.storageUrl ? _state.selected.storageUrl :
    ('/html-item/' + _state.selected._id + '?url=' + encodeURIComponent(url) + '&width=' + $(window).width() + '&height=' + $(window).height());
  if($iframe[0].src !== url) {

    $iframe[0].src = url;
    $iframe.off();
    $iframe.load(function() {
      $contents.scroll(function() {//TODO use lodash.debounce
        var scrollX = $contents.scrollLeft();
        var scrollY = $contents.scrollTop();
        if(!loading && (_state.selected.scrollX !== scrollX || _state.selected.scrollY !== scrollY)) {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(function() {
            _state.serverUpdateItem({
              _id: _state.selected._id,
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
            self.create(
              _state.selected.parent,
              url.trim(),
              showNewItemMessage
            );
          }
          else if(target && target.trim() === '_blank')
            self.createAndOpen(_state.selected.parent, url.trim());
          else
            self.createAndOpen(_state.selected.parent, url.trim(), _state.selected._id);
        }
      });
      if(_state.selected.scrollX)
        $contents.scrollLeft(_state.selected.scrollX);
      if(_state.selected.scrollY)
        $contents.scrollTop(_state.selected.scrollY);
      loading = false;
    });
  }
};

exports.create = function(parentId, url, callback) {
  _state.serverAddItemToItem(parentId, { type: 0, url: url }, function(item) {
    //TODO: navigation to the just added container is not working because websockets is taking more time to add it than ajax reponse.
    //We should fix this by sending crud request to server via websockets instead of ajax.
    setTimeout(function() {
      if(callback) callback(item);
      $.ajax({
        url: ('/html-item/' + item._id + '?url=' + encodeURIComponent(url) + '&width=' + $(window).width() + '&height=' + $(window).height()),
        cache: true
      });
    }, 1000);
  });
}

exports.createAndOpen = function(parentId, url, previousId) {
  _state.serverAddItemToItem(parentId, { type: 0, url: url, previous: previousId}, function(item) {
    //TODO: navigation to the just added container is not working because websockets is taking more time to add it than ajax reponse.
    //We should fix this by sending crud request to server via websockets instead of ajax.
    setTimeout(function() {
      page('/item/' + item._id);
    }, 1000);
  });
}
