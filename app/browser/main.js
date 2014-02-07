var Item = require('../../models/item'),
    userUpdate = require('../controllers/user_update'),
    request= require('request'),
    parser = require("./parser/parser"),
    screenshot = require("./screenshot/screenshot");

var initBrowser =  function(socket) {
      
  socket.on('browser.navigate', function (data) {
    var url = data.url;
    var itemId = data.itemId;

    request(url, function (error, response, html) {
      if (!error && response.statusCode === 200) {
        //First parse html
        parser.parseHTML(url, html, function(htmlObj) {
	  //Send response right away
	  socket.emit("browser.set.html", htmlObj.html);
	  //Generate screenshot
          screenshot.generateScreenshot(htmlObj.html, itemId, function(screenshotURL){
	    //Save item in db and update client
	    var userId = socket.handshake.user._id;
	    Item.byId(itemId).then(function(item) {
	      if(item) {
		item.title = htmlObj.title;
		item.url = url;
		item.favicon = htmlObj.favicon
		item.html = htmlObj.html;
		item.screenshot = screenshotURL;
		item.saveWithPromise()
		  .then(function() {
		    userUpdate.updateItem(userId, item);
		  })
	      }
	    }).done();
	  })
	})
      }
    })
  });

  socket.on('browser.open', function (data) {
    var itemId = data.itemId;
    Item.getHtml(itemId).then(function(item) {
      if(item) 
	  socket.emit("browser.set.html", item.html);
    }).done();
  });

  return  {
    end: function() { 
      //put end code if any
    }
  }
}

exports.initBrowser = initBrowser  
