var Item = require('../../models/item'),
  userUpdate = require('../controllers/user_update'),
  Browser = require('./browser');

var Promise = require('bluebird');

var initBrowser = function(socket) {

  var navigate = function(url, itemId) {
    var browser = new Browser;

    browser.on('html', function(data) {
      socket.emit("browser.set.html", data.html);
    });

    browser.on('end', function(data) {
      var userId = socket.handshake.user._id;
      return Item.byId(itemId).then(function(item) {
        if(item) {
          item.title = data.title;
          item.url = url;
          item.favicon = data.favicon;
          item.screenshot = data.screenshot;


          return data.storageItem.then(function(si) {
            item.storageItem = si;

            return Promise.cast(item.save())
              .then(function() {
                userUpdate.updateItem(userId, item);
              })
          });
        }
      })
    });

    browser.loadUrl(url);
  };

  socket.on('browser.navigate', function(data) {
    var url = data.url;
    var itemId = data.itemId;
    navigate(url, itemId);
  });

  socket.on('browser.open', function(data) {
    var itemId = data.itemId;
    return Item.byId(itemId).then(function(item) {
      if(item.storageItem) {
        return StorageItem.byId(item.storageItem).then(function(stored) {
          return stored.getContent();
        })
      } else {
        return navigate(item.url, itemId);
      }
    });
  });

  return  {
    end: function() {
      //put end code if any
    }
  }
}

exports.initBrowser = initBrowser  
