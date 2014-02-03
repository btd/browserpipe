var _ = require('lodash'),
    config = require('../../config'),
    Item = require('../../models/item'),
    userUpdate = require('../controllers/user_update'),
    phantom=require('node-phantom'),
    sanitizeHtml = require("sanitize-html");

function evaluatePage(){
  //This function runs on the contet of the page
  //No references can be added
  function mergeStyles(obj, style) { 
    var i = style.length; 
    while(i--) {   
      var name = style[i]; 
      obj[name] = style.getPropertyValue(name);
    }
  }
  function getElementStyle(node) {      
    var styles = {};  
    var rules = window.getMatchedCSSRules(node) || [];                                                                  
    var i = rules.length;  
    while (i--) { 
      mergeStyles(styles, rules[i].style)       
    }
    mergeStyles(styles, node.style);
    var result = '';  
    for (key in styles)
      result += key + ":" + styles[key] + ";";
    return result
  }       
  var els = document.getElementsByTagName("*");
  for(var i = -1, l = els.length; ++i < l;){
    els[i].setAttribute("style", getElementStyle(els[i]));
  }
  return {
    title: document.title,
    html: document.getElementsByTagName('html')[0].innerHTML
  }
}

function sanitizeHtml(html) {
  //TODO: sanitize html correctly
  var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  while (SCRIPT_REGEX.test(html)) {
    html = html.replace(SCRIPT_REGEX, "");
  }
  return html;
}

function getPicturePath(itemId) {
  var format = config.screenshot.format || 'jpg';
  return config.storePath + '/' + itemId + '.' + format;
}

function getPictureUrl(itemId) {
  var format = config.screenshot.format || 'jpg';
  return config.storeUrl + '/' + itemId + '.' + format;
}

var initBrowser =  function(socket) {
  var _ph;
  console.time("phantom-creation");
  phantom.create(function(err,ph) {
    console.timeEnd("phantom-creation");
    _ph = ph;
  });
      
  socket.on('browser.navigate', function (data) {
    var url = data.url;
    var itemId = data.itemId;
    console.time("page-creation");
    return _ph.createPage(function(err,page) {
      console.timeEnd("page-creation");
      console.time("page-open");
      return page.open(url, function(err,status) {
	console.timeEnd("page-open");
	console.time("page-evaluate");
	return page.evaluate(evaluatePage , function(err, result) { 
	  var title = result.title;
	  var html = result.html;
          console.timeEnd("page-evaluate");
	  //console.time("page-changeAbsURLs");
	  //replace_all_rel_by_abs(url, html);
	  //console.timeEnd("page-changeAbsURLs");
	  console.time("page-sanitizeHtml");
	  //html = sanitizeHtml(html);
	  console.timeEnd("page-sanitizeHtml");
	  //We send html and then save item for fast response
	  socket.emit("browser.set.html", html);
	  var userId = socket.handshake.user._id;
	  var screenshot_url = getPictureUrl(itemId);
	  var screenshot_path = getPicturePath(itemId);
	  Item.byId(itemId).then(function(item) {
	    if(item) {
	      item.title = title;
	      item.url = url;
	      //TODO: scrap favicon correctly
	      item.favicon = 'http://www.google.com/s2/favicons?domain=' + encodeURIComponent(item.url);
	      item.html = html;
	      item.screenshot = screenshot_url;
	      console.time("page-getScreenshot");
	      page.render(screenshot_path);
              console.timeEnd("page-getScreenshot");
	      item.saveWithPromise()
		.then(function() {
		  userUpdate.updateItem(userId, item);
		})
	    }
	  }).done();
	});
      });
    });
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
      _ph.exit();
    }
  }
}

exports.initBrowser = initBrowser  
