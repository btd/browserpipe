var _ = require('lodash'),
    config = require('../../config'),
    Item = require('../../models/item'),
    userUpdate = require('../controllers/user_update'),
    phantom=require('node-phantom'),
    sanitizeHtml = require("sanitize-html");

function rel_to_abs(base, url){
    /* Only accept commonly trusted protocols:
     * Only data-image URLs are accepted, Exotic flavours (escaped slash,
     * html-entitied characters) are not supported to keep the function fast */
  if(/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(url))
         return url; //Url is already absolute

    var base_url = base; // base.match(/^(.+)\/?(?:#.+)?$/)[0]+"/";
    if(url.substring(0,2) === "//")
        return url;
    else if(url.substring(0,2) === "./")
        url = "." + url;
    else if(/^\s*$/.test(url))
        return ""; //Empty = Return nothing
    //else url = "../" + url;

    url = base_url + url;
    var i=0
    while(/\/\.\.\//.test(url = url.replace(/[^\/]+\/+\.\.\//g,"")));

    /* Escape certain characters to prevent XSS */
    url = url.replace(/\.$/,"").replace(/\/\./g,"").replace(/"/g,"%22")
            .replace(/'/g,"%27").replace(/</g,"%3C").replace(/>/g,"%3E");
    return url;
}

function replace_all_rel_by_abs(base, html){
    /*HTML/XML Attribute may not be prefixed by these characters (common 
       attribute chars.  This list is not complete, but will be sufficient
       for this function (see http://www.w3.org/TR/REC-xml/#NT-NameChar). */
    var att = "[^-a-z0-9:._]";

    var entityEnd = "(?:;|(?!\\d))";
    var ents = {" ":"(?:\\s|&nbsp;?|&#0*32"+entityEnd+"|&#x0*20"+entityEnd+")",
                "(":"(?:\\(|&#0*40"+entityEnd+"|&#x0*28"+entityEnd+")",
                ")":"(?:\\)|&#0*41"+entityEnd+"|&#x0*29"+entityEnd+")",
                ".":"(?:\\.|&#0*46"+entityEnd+"|&#x0*2e"+entityEnd+")"};
                /* Placeholders to filter obfuscations */
    var charMap = {};
    var s = ents[" "]+"*"; //Short-hand for common use
    var any = "(?:[^>\"']*(?:\"[^\"]*\"|'[^']*'))*?[^>]*";
    /* ^ Important: Must be pre- and postfixed by < and >.
     *   This RE should match anything within a tag!  */

    /*
      @name ae
      @description  Converts a given string in a sequence of the original
                      input and the HTML entity
      @param String string  String to convert
      */
    function ae(string){
        var all_chars_lowercase = string.toLowerCase();
        if(ents[string]) return ents[string];
        var all_chars_uppercase = string.toUpperCase();
        var RE_res = "";
        for(var i=0; i<string.length; i++){
            var char_lowercase = all_chars_lowercase.charAt(i);
            if(charMap[char_lowercase]){
                RE_res += charMap[char_lowercase];
                continue;
            }
            var char_uppercase = all_chars_uppercase.charAt(i);
            var RE_sub = [char_lowercase];
            RE_sub.push("&#0*" + char_lowercase.charCodeAt(0) + entityEnd);
            RE_sub.push("&#x0*" + char_lowercase.charCodeAt(0).toString(16) + entityEnd);
            if(char_lowercase != char_uppercase){
                /* Note: RE ignorecase flag has already been activated */
                RE_sub.push("&#0*" + char_uppercase.charCodeAt(0) + entityEnd);   
                RE_sub.push("&#x0*" + char_uppercase.charCodeAt(0).toString(16) + entityEnd);
            }
            RE_sub = "(?:" + RE_sub.join("|") + ")";
            RE_res += (charMap[char_lowercase] = RE_sub);
        }
        return(ents[string] = RE_res);
    }

    /*
      @name by
      @description  2nd argument for replace().
      */
    function by(match, group1, group2, group3){
        /* Note that this function can also be used to remove links:
         * return group1 + "javascript://" + group3; */
        console.log(group1 + rel_to_abs(base, group2) + group3);
        return group1 + rel_to_abs(base, group2) + group3;
    }
    /*
      @name by2
      @description  2nd argument for replace(). Parses relevant HTML entities
      */
    var slashRE = new RegExp(ae("/"), 'g');
    var dotRE = new RegExp(ae("."), 'g');
    function by2(match, group1, group2, group3){
        /*Note that this function can also be used to remove links:
         * return group1 + "javascript://" + group3; */
        group2 = group2.replace(slashRE, "/").replace(dotRE, ".");
        console.log(group1 + rel_to_abs(base, group2) + group3);
        return group1 + rel_to_abs(base, group2) + group3;
    }
    /*
      @name cr
      @description            Selects a HTML element and performs a
                                search-and-replace on attributes
      @param String selector  HTML substring to match
      @param String attribute RegExp-escaped; HTML element attribute to match
      @param String marker    Optional RegExp-escaped; marks the prefix
      @param String delimiter Optional RegExp escaped; non-quote delimiters
      @param String end       Optional RegExp-escaped; forces the match to end
                              before an occurence of <end>
     */
    function cr(selector, attribute, marker, delimiter, end){
        if(typeof selector == "string") selector = new RegExp(selector, "gi");
        attribute = att + attribute;
        marker = typeof marker == "string" ? marker : "\\s*=\\s*";
        delimiter = typeof delimiter == "string" ? delimiter : "";
        end = typeof end == "string" ? "?)("+end : ")(";
        var re1 = new RegExp('('+attribute+marker+'")([^"'+delimiter+']+'+end+')', 'gi');
        var re2 = new RegExp("("+attribute+marker+"')([^'"+delimiter+"]+"+end+")", 'gi');
        var re3 = new RegExp('('+attribute+marker+')([^"\'][^\\s>'+delimiter+']*'+end+')', 'gi');
        html = html.replace(selector, function(match){
            return match.replace(re1, by).replace(re2, by).replace(re3, by);
        });
    }
    /* 
      @name cri
      @description            Selects an attribute of a HTML element, and
                                performs a search-and-replace on certain values
      @param String selector  HTML element to match
      @param String attribute RegExp-escaped; HTML element attribute to match
      @param String front     RegExp-escaped; attribute value, prefix to match
      @param String flags     Optional RegExp flags, default "gi"
      @param String delimiter Optional RegExp-escaped; non-quote delimiters
      @param String end       Optional RegExp-escaped; forces the match to end
                                before an occurence of <end>
     */
    function cri(selector, attribute, front, flags, delimiter, end){
        if(typeof selector == "string") selector = new RegExp(selector, "gi");
        attribute = att + attribute;
        flags = typeof flags == "string" ? flags : "gi";
        var re1 = new RegExp('('+attribute+'\\s*=\\s*")([^"]*)', 'gi');
        var re2 = new RegExp("("+attribute+"\\s*=\\s*')([^']+)", 'gi');
        var at1 = new RegExp('('+front+')([^"]+)(")', flags);
        var at2 = new RegExp("("+front+")([^']+)(')", flags);
        if(typeof delimiter == "string"){
            end = typeof end == "string" ? end : "";
            var at3 = new RegExp("("+front+")([^\"'][^"+delimiter+"]*" + (end?"?)("+end+")":")()"), flags);
            var handleAttr = function(match, g1, g2){return g1+g2.replace(at1, by2).replace(at2, by2).replace(at3, by2)};
        } else {
            var handleAttr = function(match, g1, g2){return g1+g2.replace(at1, by2).replace(at2, by2)};
    }
        html = html.replace(selector, function(match){
             return match.replace(re1, handleAttr).replace(re2, handleAttr);
        });
    }

    /* <meta http-equiv=refresh content="  ; url= " > */
    cri("<meta"+any+att+"http-equiv\\s*=\\s*(?:\""+ae("refresh")+"\""+any+">|'"+ae("refresh")+"'"+any+">|"+ae("refresh")+"(?:"+ae(" ")+any+">|>))", "content", ae("url")+s+ae("=")+s, "i");

    cr("<"+any+att+"href\\s*="+any+">", "href"); /* Linked elements */
    cr("<"+any+att+"src\\s*="+any+">", "src"); /* Embedded elements */

    cr("<object"+any+att+"data\\s*="+any+">", "data"); /* <object data= > */
    cr("<applet"+any+att+"codebase\\s*="+any+">", "codebase"); /* <applet codebase= > */

    /* <param name=movie value= >*/
    cr("<param"+any+att+"name\\s*=\\s*(?:\""+ae("movie")+"\""+any+">|'"+ae("movie")+"'"+any+">|"+ae("movie")+"(?:"+ae(" ")+any+">|>))", "value");

    cr(/<style[^>]*>(?:[^"']*(?:"[^"]*"|'[^']*'))*?[^'"]*(?:<\/style|$)/gi, "url", "\\s*\\(\\s*", "", "\\s*\\)"); /* <style> */
    cri("<"+any+att+"style\\s*="+any+">", "style", ae("url")+s+ae("(")+s, 0, s+ae(")"), ae(")")); /*< style=" url(...) " > */
    return html;
}

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
	  console.time("page-changeAbsURLs");
	  //replace_all_rel_by_abs(url, html);
	  console.timeEnd("page-changeAbsURLs");
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
