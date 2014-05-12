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
      $body.append('<style type="text/css">#bwp_context_menu {background-color:#ccc;border: 1px solid #666;width: 150px;padding: 3px 0;list-style-type: none;position: absolute;} #bwp_context_menu li{padding: 6px;} #bwp_context_menu li:hover{cursor:pointer;background-color: #ff6d16;color: #fff;}</style>');
      $body.on('contextmenu', function(e) {
          var $target = $(e.target);
          if($target.is('a')) {
            $("#bwp_context_menu", this).remove();
            e.preventDefault();
            var $contextMenu = $("<ul id='bwp_context_menu'><li>Open in new tab</li></div>")
              .appendTo(this)
              .css({
                display: "block",
                left: e.pageX,
                top: e.pageY
              });
            $contextMenu.on("click", "li", function() {
              var url = $target.attr("href");
              if(url)
                self.createInBrowser(_state.selectedItem._id, url);
              $contextMenu.remove();
            });
            return false;
          }
      }).on('click', function(e) {
        $("#bwp_context_menu", this).remove();
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
    setTimeout(function() {
      $.ajax({
        url: ('/html-item/' + item._id + '?url=' + encodeURIComponent(url) + '&width=' + $(window).width() + '&height=' + $(window).height()),
        cache: true
      });
    }, 1000);
  });
}

exports.createAndOpenInBrowser = function(parentId, url, previousId, callback) {
  _state.serverAddItemToBrowser(parentId, { type: 0, url: url, previous: previousId}, function(item) {
    //TODO: navigation to the just added container is not working because websockets is taking more time to add it than ajax reponse.
    //We should fix this by sending crud request to server via websockets instead of ajax.
    setTimeout(function() {
      _state.sidebarTab = "browser";
      page('/item/' + item._id);
      if(callback) callback(item);
    }, 1000);
  });
}
