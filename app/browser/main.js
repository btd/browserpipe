var Item = require('../../models/item'),
  StorageItem = require('../../models/storage-item'),
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
      //var userId = socket.handshake.user._id;
      return Item.byId(itemId).then(function(item) {
        if(item) {
          item.title = data.title;
          item.url = url;
          item.favicon = data.favicon;
          item.screenshot = data.screenshot;

          return data.storageItem.then(function(si) {
            console.log(si);
            item.storageItem = si._id;

            return Promise.cast(item.save())
              .then(function() {
                console.log('SAVED');
                userUpdate.updateItem(item.user, item);
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
    return Promise.cast(Item.byId(itemId)).then(function(item) {
      console.log(item);
      if(item.storageItem) {
        console.log('Sid', item.storageItem);
        return Promise.cast(StorageItem.by({ _id: item.storageItem }))
          .then(function(stored) {
            console.log('S', stored);
            if(stored) {
              return stored.getContent().then(function(content) {
                socket.emit("browser.set.html",content);
              })
            } else if(item.url){
              return navigate(item.url, itemId);
            }
          })
      } else if(item.url){
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
