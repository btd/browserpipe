
function BaseHandler(options) {
  if(options && options.callback)
    this.callback = options.callback;

  if(options && options.browser)
    this.browser = options.browser;

  if(options && options.url)
    this.url = options.url;

  this.next = [];
}

BaseHandler.prototype = {
  callNext: function(f, args) {
    this.next.forEach(function(n) {
      n[f] && n[f].apply(n, args);
    })
  },

  addNext: function(nextHandler) {

    nextHandler.browser = this.browser;
    nextHandler.url = this.url;
    nextHandler.init();

    this.next.push(nextHandler);
    return this;
  },

  gather: function(data) {

  },

  init: function() {

  },

  fillData: function(data) {
    this.gather(data);
    this.next.forEach(function(n) {
      n.fillData(data);
    })
  },

  onend: function() {
    var content = {};
    this.fillData(content);
    this.callback(null, content);
  },

  onerror: function(err) {
    this.callback(err);
  }
};

addBaseMethod('onclosetag', 'onCloseTag');
addBaseMethod('ontext', 'onText');
addBaseMethod('onprocessinginstruction', 'onProcessingInstruction');
addBaseMethod('onopentag', 'onOpenTag');

function addBaseMethod(originalName, name) {
  BaseHandler.prototype[originalName] = function() {
    var that = this;
    var args = Array.prototype.slice.call(arguments);
    var next = function() {
      that.callNext(originalName, args);
    };
    if(this[name]) {
      this[name].apply(this, args.concat([next]));
    } else {
      next();
    }
  }
}

BaseHandler.prototype.ontext = function(text) {
  var that = this;
  var newText = { text: text };
  if(this.onText) {
    this.onText(newText, function() {
      that.callNext('ontext', [newText.text]);
    });
  } else {
    that.callNext('ontext', [text]);
  }
}


module.exports = BaseHandler;