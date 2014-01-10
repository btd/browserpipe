var _ = require('lodash'),
    express = require('express'),
    mongoStore = require('connect-mongo')(express),
    config = require('../config'),
    userUpdate = require('./controllers/user_update'),
    Item = require('../models/item'),
    io = require('socket.io'),
    phantom=require('node-phantom'),
    sanitizeHtml = require("sanitize-html");

var userUpdate = require('./controllers/user_update');

module.exports = function () {

    var parseCookie = function (auth, cookieHeader) {
        var cookieParser = auth.cookieParser(auth.secret);
        var req = {
            headers: {
                cookie: cookieHeader
            }
        };
        var result;
        cookieParser(req, {}, function (err) {
            if (err) throw err;
            result = req.signedCookies;
        });
        return result;
    }

    var authorize = function (options) {
        var defaults = {
            passport: require('passport'),
            key: 'connect.sid',
            secret: null,
            store: null,
            success: null,
            fail: null
        };

        var auth = _.extend({}, defaults, options);

        auth.userProperty = auth.passport._userProperty || 'user';

        if (typeof auth.cookieParser === 'undefined' || !auth.cookieParser) {
            throw new Error('cookieParser is required use connect.cookieParser or express.cookieParser');
        }

        return function (data, accept) {
            if (!data.headers.cookie) {
                return accept(null, false);
            }

            data.cookie = parseCookie(auth, data.headers.cookie);

            data.sessionID = data.cookie[auth.key];

            auth.store.get(data.sessionID, function (err, session) {
                if (err) {
                    return accept('Error in session store.', false);
                } else if (!session) {
                    return accept(null, false);
                }

                if (!session[auth.passport._key]) {
                    return accept('passport was not initialized', false);
                }

                var userKey = session[auth.passport._key][auth.userProperty];

                if (userKey === undefined) {
                    if (auth.fail)
                        return auth.fail(data, accept);
                    else
                        return accept(null, false);
                }

                auth.passport.deserializeUser(userKey, function (err, user) {
                    data[auth.userProperty] = user;
                    if (auth.success) {
                        return auth.success(data, accept);
                    }
                    accept(null, true);
                });

            });
        };
    };






var rel_to_abs = function(base, url){
    /* Only accept commonly trusted protocols:
     * Only data-image URLs are accepted, Exotic flavours (escaped slash,
     * html-entitied characters) are not supported to keep the function fast */
  if(/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(url))
         return url; //Url is already absolute

    var base_url = base; // base.match(/^(.+)\/?(?:#.+)?$/)[0]+"/";

console.log(base_url);
console.log(url);
    if(url.substring(0,2) == "//")
        return url;
    else if(url.substring(0,2) == "./")
        url = "." + url;
    else if(/^\s*$/.test(url))
        return ""; //Empty = Return nothing
    else url = "../" + url;

    url = base_url + url;
console.log(url);
    var i=0
    while(/\/\.\.\//.test(url = url.replace(/[^\/]+\/+\.\.\//g,"")));

    /* Escape certain characters to prevent XSS */
    url = url.replace(/\.$/,"").replace(/\/\./g,"").replace(/"/g,"%22")
            .replace(/'/g,"%27").replace(/</g,"%3C").replace(/>/g,"%3E");
    return url;
}





var  replace_all_rel_by_abs = function(base, html){
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


















    /*var filterSocketsByUser = function (sio, filter) {
        var handshaken = sio.sockets.manager.handshaken;
        return Object.keys(handshaken || {})
            .filter(function (skey) {
                return filter(handshaken[skey].user);
            })
            .map(function (skey) {
                return sio.sockets.manager.sockets.sockets[skey];
            });
    };*/

    return {

        init: function (server) {
            this.sio = io.listen(server, config['socket-io']);

            this.sio.set("authorization", authorize({
                cookieParser: express.cookieParser, //or connect.cookieParser
                secret: config.cookieSecret, //the session secret to parse the cookie
                store: new mongoStore(config["connect-mongo"]), //the session store that express uses
                fail: function (data, accept) { // *optional* callbacks on success or fail
                    accept(null, false); // second param takes boolean on whether or not to allow handshake
                },
                success: function (data, accept) {
                    accept(null, true);
                }
            }));


            this.sio.sockets.on("connection", function (socket) {
                //console.log("user connected: ", socket.handshake.user.name);
                var client = userUpdate.waitUserUpdates(socket.handshake.user._id, function(event, data) {
                    socket.emit(event, data);
                });
		
		socket.on('navigate', function (data) {
		  var url = data.url;
                  var itemId = data.itemId;

		  phantom.create(function(err,ph) {
  		    return ph.createPage(function(err,page) {
		      return page.open(url, function(err,status) {
			return page.evaluate(function() {

    var getElementStyle = function(node) {                                                                                                      

      var styles = {};                                                                                                                          
      var rules = window.getMatchedCSSRules(node) || [];                                                                  
      var i = rules.length;                                                                                                                     
      while (i--) {                                                                                                                             
        merge(styles, rules[i].style)                                                                                                           
      }                                                                                                                                         
      merge(styles, node.style);                         
                                                                                       
      var result = '';                                                                                                                          
      for (key in styles)                                                                                                                    
        result += key + ":" + styles[key] + ";"; 
      return result;                                                                                                                            
                                                                                                                                                
      function merge(obj, style) {                                                                                                              
        var i = style.length;                                                                                                                   
        while(i--) {                                                                                                                            
          var name = style[i];                                                                                                                  
          obj[name] = style.getPropertyValue(name);                                                                                          
        }                                                                                                                                       
      }                                                                                                                                         
    }       

			  var els = document.getElementsByTagName("*");
			  for(var i = -1, l = els.length; ++i < l;){
    			    els[i].setAttribute("style", getElementStyle(els[i]));
			  }
 		          return document.getElementsByTagName('html')[0].innerHTML;
       			} , function(err, html) {
html = replace_all_rel_by_abs(url, html);
		        var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
while (SCRIPT_REGEX.test(html)) {
    html = html.replace(SCRIPT_REGEX, "");
}
//        var sanitizedHTML = sanitizeHtml(html);
//			  socket.emit('html', html);
        var userId = socket.handshake.user._id;
        Item.byId(itemId).then(function(item) {
            if(item) {
	        item.url = url;
	        item.html = html;
                item.saveWithPromise()
                  .then(function() {
                    userUpdate.updateItem(userId, item);
                  })
            }
        }).done();
			  ph.exit();
      			});
      		      });
    		    });
 		  });
		});

                socket.on('disconnect', function(){
                    client.end();
                });
            });
        }/*,
        socketMiddleware: function () {
            var self = this;
            return function (req, res, next) {
                if (req.isAuthenticated()) {
                    var id = req.user._id.toString();
                    req.sockets = filterSocketsByUser(self.sio, function (user) {
                        return user._id.toString() === id;
                    });
                }
                next();
            }
        }*/
    }
}();
