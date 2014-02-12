
function BaseHandler(options) {
  if(options && options.callback)
    this.callback = options.callback;

  this.next = [];
}

BaseHandler.prototype = {
  callNext: function(f, args) {
    this.next.forEach(function(n) {
      n[f] && n[f].apply(n, args);
    })
  },

  addNext: function(next) {
    this.next.push(next);
    return this;
  },

  gather: function(data) {

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

module.exports = BaseHandler;