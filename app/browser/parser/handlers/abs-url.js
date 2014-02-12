var Base = require('./base');

var url = require('url');

var tags = {
  img: {
    attributes: {
      src: /^(.*)$/i,
      longdesc: /^(.*)$/i,
      usemap: /^(.*)$/i
    }
  },
  input: {
    attributes: {
      src: /^(.*)$/i,
      formaction: /^(.*)$/i,
      usemap: /^(.*)$/i
    }
  },
  area: {
    attributes: {
      href: /^(.*)$/i
    }
  },
  base: {
    attributes: {
      href: /^(.*)$/i
    }
  },
  del: {
    attributes: {
      cite: /^(.*)$/i
    }
  },
  form: {
    attributes: {
      action: /^(.*)$/i
    }
  },
  head: {
    attributes: {
      profile: /^(.*)$/i
    }
  },
  blockquote: {
    attributes: {
      cite: /^(.*)$/i
    }
  },
  ins: {
    attributes: {
      cite: /^(.*)$/i
    }
  },
  q: {
    attributes: {
      cite: /^(.*)$/i
    }
  },
  body: {
    attributes: {
      background: /^(.*)$/i
    }
  },
  link: {
    attributes: {
      href: /^(.*)$/i
    }
  },
  style: {
    content: /url\((.*)\)/gi
  },
  button: {
    attributes: {
      formaction: /^(.*)$/
    }
  },
  command: {
    attributes: {
      icon: /^(.*)$/
    }
  },
  html: {
    attributes: {
      manifest: /^(.*)$/
    }
  },
  '*': {
    attributes: {
      style: /url\((.*)\)/gi
    }
  }
};

var AbsUrlHandler = function(options) {
  this.baseUrl = options.url;
  this.parsedUrl = url.parse(options.url);

  Base.apply(this, arguments);
};

AbsUrlHandler.prototype = Object.create(Base.prototype);

AbsUrlHandler.prototype.processTag = function(replace, attributes) {
  var that = this;
  function replaceUrl(url) {
    return that.replaceUrl(url);
  }
  var attrs = replace.attributes;
  if(attrs) {
    for(var attr in attrs) {
      if(attributes[attr]) {
        console.log('replace', attr, attributes[attr]);
        attributes[attr] = attributes[attr].replace(attrs[attr], replaceUrl);
        //console.log(attributes[attr]);
      }
    }
  }
  var content = replace.content;
  //if(content) {
  //  this.replacingContent = true;
  //  this.replaceRule = replace;
  //}
};

//http://stackoverflow.com/questions/7544550/javascript-regex-to-change-all-relative-urls-to-absolute
AbsUrlHandler.prototype.replaceUrl = function(_url) {
  if(/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(_url))
    return _url; //Url is already absolute


  if(_url.substring(0,2) == "//")
    return this.parsedUrl.protocol + _url;
  else if(_url.charAt(0) == "/")
    return this.parsedUrl.protocol + "//" + this.parsedUrl.host + _url;
  else if(_url.substring(0,2) == "./")
    return url.resolve(this.baseUrl, _url);
  else if(/^\s*$/.test(_))
    return ""; //Empty = Return nothing
  else
    return url.resolve(this.baseUrl, "../" + _url);
};

AbsUrlHandler.prototype.onOpenTag = function(name, attributes, next) {
  var replaceRule = tags[name];
  if(replaceRule) {
    if(replaceRule.test) {
      if(replaceRule.test(name, attributes)) {
        this.processTag(replaceRule, attributes);
      }
    } else {
      this.processTag(replaceRule, attributes);
    }
  }
  this.processTag(tags['*'], attributes);
  next();
};

//TODO process content of style

module.exports = AbsUrlHandler;
