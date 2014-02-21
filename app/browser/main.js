var Item = require('../../models/item'),
  userUpdate = require('../controllers/user_update'),
  Browser = require('./browser');

var initBrowser = function (socket) {

  var navigate = function(url, itemId) {
    var browser = new Browser;

    browser.once('html', function(data) {
      socket.emit("browser.set.html", data.html);

      browser.once('screenshot', function(screenshot) {
        var userId = socket.handshake.user._id;
        Item.byId(itemId).then(function (item) {
          if (item) {
            item.title = data.title;
            item.url = url;
            item.favicon = data.favicon
            item.html = data.html;
            item.screenshot = screenshot;
            item.saveWithPromise()
              .then(function () {
                userUpdate.updateItem(userId, item);
              })
          }
        }).done();
      });
    });

    browser.loadUrl(url);
  }

  socket.on('browser.navigate', function (data) {
    var url = data.url;
    var itemId = data.itemId;
    navigate(url, itemId);
  });

  socket.on('browser.open', function (data) {
    var itemId = data.itemId;
    Item.getHtml(itemId).then(function (item) {
      if (item && item.url){
        if (item.html)
          socket.emit("browser.set.html", item.html);
	else 
	  navigate(item.url, item._id);
      }
    }).done();
  });

  return  {
    end: function () {
      //put end code if any
    }
  }
}

exports.initBrowser = initBrowser  
