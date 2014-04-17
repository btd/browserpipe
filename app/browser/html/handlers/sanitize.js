var Base = require('./base');

var handlers = ["onabort", "onafterprint", "onbeforeprint", "onbeforeunload", "onblur", "oncancel", "oncanplay", "oncanplaythrough", "onchange", "onclick", "onclose", "oncontextmenu", "oncuechange", "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragexit", "ondragleave", "ondragover", "ondragstart", "ondrop", "ondurationchange", "onemptied", "onended", "onerror", "onfocus", "onhashchange", "oninput", "oninvalid", "onkeydown", "onkeypress", "onkeyup", "onlanguagechange", "onload", "onloadeddata", "onloadedmetadata", "onloadstart", "onmessage", "onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onmousewheel", "onoffline", "ononline", "onpagehide", "onpageshow", "onpause", "onplay", "onplaying", "onpopstate", "onprogress", "onratechange", "onreset", "onresize", "onscroll", "onseeked", "onseeking", "onselect", "onshow", "onsort", "onstalled", "onstorage", "onsubmit", "onsuspend", "ontimeupdate", "ontoggle", "onunload", "onvolumechange", "onwaiting"];

var blacklist = {
  iframe: true,
  frameset: true,
  frame: true,
  audio: true,
  embed: true,
  object: true,
  video: true,
  applet: true,
  script: true
};

var SanitizeHandler = function() {
  this.stack = [];

  Base.apply(this, arguments);
};

SanitizeHandler.prototype = Object.create(Base.prototype);


SanitizeHandler.prototype.onOpenTag = function(name, attributes, next) {
  if(this.stack.length == 0 && !blacklist[name]) { //do not save 'scripts'
    //remove all on* callbacks
    handlers.forEach(function(n) {
      delete attributes[n];
    });

    next();
  } else {
    this.stack.push(name);
  }
};

SanitizeHandler.prototype.onText = function(_, next) {
  if(this.stack.length == 0) { // in this case we do not skipping anything
    next();
  }
};

SanitizeHandler.prototype.onCloseTag = function(name, next) {
  if(this.stack.length != 0) {
    if(this.stack[this.stack.length - 1] != name) console.error('stack problem');
    this.stack.pop();
  } else {
    next();
  }
};

module.exports = SanitizeHandler;
