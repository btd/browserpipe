// Generated by CoffeeScript 1.3.3
(function() {
  var Base, EventEmitter, Module, guids, mixer,
    __slice = [].slice;

  EventEmitter = (function() {

    function EventEmitter() {
      this.events = {};
    }

    EventEmitter.prototype.emit = function() {
      var args, e, listener, _i, _len, _ref;
      e = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!this.events[e]) {
        return false;
      }
      _ref = this.events[e];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        listener.apply(null, args);
      }
      return true;
    };

    EventEmitter.prototype.addListener = function(e, listener) {
      var _base, _ref;
      this.emit('newListener', e, listener);
      ((_ref = (_base = this.events)[e]) != null ? _ref : _base[e] = []).push(listener);
      return this;
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    EventEmitter.prototype.once = function(e, listener) {
      var fn,
        _this = this;
      fn = function() {
        _this.removeListener(e, fn);
        return listener.apply(null, arguments);
      };
      this.on(e, fn);
      return this;
    };

    EventEmitter.prototype.removeListener = function(e, listener) {
      var l;
      if (!this.events[e]) {
        return this;
      }
      this.events[e] = (function() {
        var _i, _len, _ref, _results;
        _ref = this.events[e];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          l = _ref[_i];
          if (l !== listener) {
            _results.push(l);
          }
        }
        return _results;
      }).call(this);
      return this;
    };

    EventEmitter.prototype.removeAllListeners = function(e) {
      if (e != null) {
        delete this.events[e];
      } else {
        this.events = {};
      }
      return this;
    };

    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

    EventEmitter.prototype.offAll = EventEmitter.prototype.removeAllListeners;

    return EventEmitter;

  })();

  Base = function() {};

  Module = {
    create: function(o) {
      if (o == null) {
        o = {};
      }
      return mixer.extend(this.clone(), o);
    },
    clone: function() {
      return mixer.create(this);
    },
    extend: function(o) {
      return mixer.extend(this, o);
    },
    get: function(k) {
      return this._.props[k];
    },
    getAll: function() {
      return this._.props;
    },
    set: function(k, v, silent) {
      var ky;
      if (silent == null) {
        silent = false;
      }
      if (typeof k === 'object') {
        for (ky in k) {
          v = k[ky];
          this.set(ky, v);
        }
        return this;
      } else {
        this._.props[k] = v;
        if (!silent) {
          this.emit("change", k, v);
          this.emit("change:" + k, v);
        }
        return this;
      }
    },
    has: function(k) {
      return this._.props[k] != null;
    },
    remove: function(k, silent) {
      if (silent == null) {
        silent = false;
      }
      delete this._.props[k];
      if (!silent) {
        this.emit("change", k);
        this.emit("change:" + k);
        this.emit("remove", k);
        this.emit("remove:" + k);
      }
      return this;
    },
    emit: function() {
      var d, e, _ref;
      e = arguments[0], d = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      (_ref = this._.events).emit.apply(_ref, [e].concat(__slice.call(d)));
      mixer.emit.apply(mixer, [e, this].concat(__slice.call(d)));
      return this;
    },
    on: function(e, fn) {
      this._.events.on(e, fn.bind(this));
      return this;
    },
    once: function(e, fn) {
      this._.events.once(e, fn.bind(this));
      return this;
    },
    off: function() {
      var a, _ref;
      a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      (_ref = this._.events).off.apply(_ref, a);
      return this;
    },
    offAll: function() {
      var a, _ref;
      a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      (_ref = this._.events).offAll.apply(_ref, a);
      return this;
    }
  };

  guids = -1;

  mixer = {
    _: {},
    events: new EventEmitter,
    emitter: EventEmitter,
    create: function(o) {
      var inst;
      inst = mixer.nu(o);
      mixer.extend(inst, Module);
      inst.guid = ++guids;
      inst._ = mixer._[inst.guid] = {
        props: {},
        events: new mixer.emitter
      };
      return inst;
    },
    nu: function(o) {
      Base.prototype = o;
      return new Base;
    },
    clone: function(o) {
      return mixer.extend({}, o);
    },
    extend: function(o, n) {
      var k, v;
      for (k in n) {
        v = n[k];
        o[k] = v;
      }
      return o;
    }
  };

  mixer.extend(mixer, mixer.events);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = mixer;
  } else {
    window.mixer = mixer;
  }

}).call(this);
// rivets.js
// version: 0.3.11
// author: Michael Richards
// license: MIT
(function() {
  var Rivets, attributeBinding, bindEvent, classBinding, eventBinding, getInputValue, iterationBinding, rivets, unbindEvent,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Rivets = {};

  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }

  Rivets.Binding = (function() {

    function Binding(el, type, model, keypath, options) {
      this.el = el;
      this.type = type;
      this.model = model;
      this.keypath = keypath;
      this.options = options != null ? options : {};
      this.unbind = __bind(this.unbind, this);

      this.bind = __bind(this.bind, this);

      this.publish = __bind(this.publish, this);

      this.sync = __bind(this.sync, this);

      this.set = __bind(this.set, this);

      this.formattedValue = __bind(this.formattedValue, this);

      this.isBidirectional = __bind(this.isBidirectional, this);

      this.routine = (function() {
        switch (this.options.special) {
          case 'event':
            return eventBinding(this.type);
          case 'class':
            return classBinding(this.type);
          case 'iteration':
            return iterationBinding(this.type);
          default:
            return Rivets.routines[this.type] || attributeBinding(this.type);
        }
      }).call(this);
      this.formatters = this.options.formatters || [];
    }

    Binding.prototype.isBidirectional = function() {
      var _ref;
      return (_ref = this.type) === 'value' || _ref === 'checked' || _ref === 'unchecked';
    };

    Binding.prototype.formattedValue = function(value) {
      var args, formatter, id, _i, _len, _ref, _ref1, _ref2;
      _ref = this.formatters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        formatter = _ref[_i];
        args = formatter.split(/\s+/);
        id = args.shift();
        value = this.model[id] instanceof Function ? (_ref1 = this.model)[id].apply(_ref1, [value].concat(__slice.call(args))) : Rivets.formatters[id] ? (_ref2 = Rivets.formatters)[id].apply(_ref2, [value].concat(__slice.call(args))) : void 0;
      }
      return value;
    };

    Binding.prototype.set = function(value) {
      value = value instanceof Function && this.options.special !== 'event' ? this.formattedValue(value.call(this.model)) : this.formattedValue(value);
      if (this.options.special === 'event') {
        return this.currentListener = this.routine(this.el, this.model, value, this.currentListener);
      } else if (this.options.special === 'iteration') {
        return this.routine(this.el, value, this);
      } else {
        return this.routine(this.el, value);
      }
    };

    Binding.prototype.sync = function() {
      return this.set(this.options.bypass ? this.model[this.keypath] : Rivets.config.adapter.read(this.model, this.keypath));
    };

    Binding.prototype.publish = function() {
      return Rivets.config.adapter.publish(this.model, this.keypath, getInputValue(this.el));
    };

    Binding.prototype.bind = function() {
      var dependency, keypath, model, _i, _len, _ref, _ref1;
      if (this.options.bypass) {
        this.sync();
      } else {
        Rivets.config.adapter.subscribe(this.model, this.keypath, this.sync);
        if (Rivets.config.preloadData) {
          this.sync();
        }
      }
      if ((_ref = this.options.dependencies) != null ? _ref.length : void 0) {
        _ref1 = this.options.dependencies;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          dependency = _ref1[_i];
          if (/^\./.test(dependency)) {
            model = this.model;
            keypath = dependency.substr(1);
          } else {
            dependency = dependency.split('.');
            model = this.view.models[dependency.shift()];
            keypath = dependency.join('.');
          }
          Rivets.config.adapter.subscribe(model, keypath, this.sync);
        }
      }
      if (this.isBidirectional() && !this.options.bypass) {
        return bindEvent(this.el, 'change', this.publish);
      }
    };

    Binding.prototype.unbind = function() {
      var keypath, _i, _len, _ref, _ref1;
      if (!this.options.bypass) {
        Rivets.config.adapter.unsubscribe(this.model, this.keypath, this.sync);
        if ((_ref = this.options.dependencies) != null ? _ref.length : void 0) {
          _ref1 = this.options.dependencies;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            keypath = _ref1[_i];
            Rivets.config.adapter.unsubscribe(this.model, keypath, this.sync);
          }
        }
        if (this.isBidirectional()) {
          return this.el.removeEventListener('change', this.publish);
        }
      }
    };

    return Binding;

  })();

  Rivets.View = (function() {

    function View(els, models) {
      this.els = els;
      this.models = models;
      this.publish = __bind(this.publish, this);

      this.sync = __bind(this.sync, this);

      this.unbind = __bind(this.unbind, this);

      this.bind = __bind(this.bind, this);

      this.select = __bind(this.select, this);

      this.build = __bind(this.build, this);

      this.bindingRegExp = __bind(this.bindingRegExp, this);

      if (!(this.els.jquery || this.els instanceof Array)) {
        this.els = [this.els];
      }
      this.build();
    }

    View.prototype.bindingRegExp = function() {
      var prefix;
      prefix = Rivets.config.prefix;
      if (prefix) {
        return new RegExp("^data-" + prefix + "-");
      } else {
        return /^data-/;
      }
    };

    View.prototype.build = function() {
      var bindingRegExp, classRegExp, el, eventRegExp, iterationRegExp, iterator, node, parseNode, skipNodes, _i, _j, _len, _len1, _ref, _ref1,
        _this = this;
      this.bindings = [];
      skipNodes = [];
      iterator = null;
      bindingRegExp = this.bindingRegExp();
      eventRegExp = /^on-/;
      classRegExp = /^class-/;
      iterationRegExp = /^each-/;
      parseNode = function(node) {
        var a, attribute, binding, context, ctx, dependencies, keypath, model, n, options, path, pipe, pipes, splitPath, type, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2;
        if (__indexOf.call(skipNodes, node) < 0) {
          _ref = node.attributes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            attribute = _ref[_i];
            if (bindingRegExp.test(attribute.name)) {
              type = attribute.name.replace(bindingRegExp, '');
              if (iterationRegExp.test(type)) {
                if (!_this.models[type.replace(iterationRegExp, '')]) {
                  _ref1 = node.getElementsByTagName('*');
                  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                    n = _ref1[_j];
                    skipNodes.push(n);
                  }
                  iterator = [attribute];
                }
              }
            }
          }
          _ref2 = iterator || node.attributes;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            attribute = _ref2[_k];
            if (bindingRegExp.test(attribute.name)) {
              options = {};
              type = attribute.name.replace(bindingRegExp, '');
              pipes = (function() {
                var _l, _len3, _ref3, _results;
                _ref3 = attribute.value.split('|');
                _results = [];
                for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
                  pipe = _ref3[_l];
                  _results.push(pipe.trim());
                }
                return _results;
              })();
              context = (function() {
                var _l, _len3, _ref3, _results;
                _ref3 = pipes.shift().split('<');
                _results = [];
                for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
                  ctx = _ref3[_l];
                  _results.push(ctx.trim());
                }
                return _results;
              })();
              path = context.shift();
              splitPath = path.split(/\.|:/);
              options.formatters = pipes;
              options.bypass = path.indexOf(':') !== -1;
              if (splitPath[0]) {
                model = _this.models[splitPath.shift()];
              } else {
                model = _this.models;
                splitPath.shift();
              }
              keypath = splitPath.join('.');
              if (model) {
                if (dependencies = context.shift()) {
                  options.dependencies = dependencies.split(/\s+/);
                }
                if (eventRegExp.test(type)) {
                  type = type.replace(eventRegExp, '');
                  options.special = 'event';
                }
                if (classRegExp.test(type)) {
                  type = type.replace(classRegExp, '');
                  options.special = 'class';
                }
                if (iterationRegExp.test(type)) {
                  type = type.replace(iterationRegExp, '');
                  options.special = 'iteration';
                }
                binding = new Rivets.Binding(node, type, model, keypath, options);
                binding.view = _this;
                _this.bindings.push(binding);
              }
            }
            if (iterator) {
              for (_l = 0, _len3 = iterator.length; _l < _len3; _l++) {
                a = iterator[_l];
                node.removeAttribute(a.name);
              }
              iterator = null;
            }
          }
        }
      };
      _ref = this.els;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        parseNode(el);
        _ref1 = el.getElementsByTagName('*');
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          node = _ref1[_j];
          parseNode(node);
        }
      }
    };

    View.prototype.select = function(fn) {
      var binding, _i, _len, _ref, _results;
      _ref = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        if (fn(binding)) {
          _results.push(binding);
        }
      }
      return _results;
    };

    View.prototype.bind = function() {
      var binding, _i, _len, _ref, _results;
      _ref = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        _results.push(binding.bind());
      }
      return _results;
    };

    View.prototype.unbind = function() {
      var binding, _i, _len, _ref, _results;
      _ref = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        _results.push(binding.unbind());
      }
      return _results;
    };

    View.prototype.sync = function() {
      var binding, _i, _len, _ref, _results;
      _ref = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        _results.push(binding.sync());
      }
      return _results;
    };

    View.prototype.publish = function() {
      var binding, _i, _len, _ref, _results;
      _ref = this.select(function(b) {
        return b.isBidirectional();
      });
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        _results.push(binding.publish());
      }
      return _results;
    };

    return View;

  })();

  bindEvent = function(el, event, handler, context) {
    var fn;
    fn = function(e) {
      return handler.call(context, e);
    };
    if (window.jQuery != null) {
      el = jQuery(el);
      if (el.on != null) {
        el.on(event, fn);
      } else {
        el.bind(event, fn);
      }
    } else if (window.addEventListener != null) {
      el.addEventListener(event, fn, false);
    } else {
      event = 'on' + event;
      el.attachEvent(event, fn);
    }
    return fn;
  };

  unbindEvent = function(el, event, fn) {
    if (window.jQuery != null) {
      el = jQuery(el);
      if (el.off != null) {
        return el.off(event, fn);
      } else {
        return el.unbind(event, fn);
      }
    } else if (window.removeEventListener) {
      return el.removeEventListener(event, fn, false);
    } else {
      event = 'on' + event;
      return el.detachEvent(event, fn);
    }
  };

  getInputValue = function(el) {
    var o, _i, _len, _results;
    switch (el.type) {
      case 'checkbox':
        return el.checked;
      case 'select-multiple':
        _results = [];
        for (_i = 0, _len = el.length; _i < _len; _i++) {
          o = el[_i];
          if (o.selected) {
            _results.push(o.value);
          }
        }
        return _results;
        break;
      default:
        return el.value;
    }
  };

  eventBinding = function(event) {
    return function(el, context, bind, unbind) {
      if (unbind) {
        unbindEvent(el, event, unbind);
      }
      return bindEvent(el, event, bind, context);
    };
  };

  classBinding = function(name) {
    return function(el, value) {
      var elClass, hasClass;
      elClass = " " + el.className + " ";
      hasClass = elClass.indexOf(" " + name + " ") !== -1;
      if (!value === hasClass) {
        return el.className = value ? "" + el.className + " " + name : elClass.replace(" " + name + " ", ' ').trim();
      }
    };
  };

  iterationBinding = function(name) {
    return function(el, collection, binding) {
      var data, item, itemEl, iteration, m, n, previous, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
      if (binding.iterated != null) {
        _ref = binding.iterated;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          iteration = _ref[_i];
          iteration.view.unbind();
          iteration.el.parentNode.removeChild(iteration.el);
        }
      } else {
        binding.marker = document.createComment(" rivets: each-" + name + " ");
        el.parentNode.insertBefore(binding.marker, el);
        el.parentNode.removeChild(el);
      }
      binding.iterated = [];
      _results = [];
      for (_j = 0, _len1 = collection.length; _j < _len1; _j++) {
        item = collection[_j];
        data = {};
        _ref1 = binding.view.models;
        for (n in _ref1) {
          m = _ref1[n];
          data[n] = m;
        }
        data[name] = item;
        itemEl = el.cloneNode(true);
        previous = binding.iterated[binding.iterated.length - 1] || binding.marker;
        binding.marker.parentNode.insertBefore(itemEl, (_ref2 = previous.nextSibling) != null ? _ref2 : null);
        _results.push(binding.iterated.push({
          el: itemEl,
          view: rivets.bind(itemEl, data)
        }));
      }
      return _results;
    };
  };

  attributeBinding = function(attr) {
    return function(el, value) {
      if (value) {
        return el.setAttribute(attr, value);
      } else {
        return el.removeAttribute(attr);
      }
    };
  };

  Rivets.routines = {
    enabled: function(el, value) {
      return el.disabled = !value;
    },
    disabled: function(el, value) {
      return el.disabled = !!value;
    },
    checked: function(el, value) {
      if (el.type === 'radio') {
        return el.checked = el.value === value;
      } else {
        return el.checked = !!value;
      }
    },
    unchecked: function(el, value) {
      if (el.type === 'radio') {
        return el.checked = el.value !== value;
      } else {
        return el.checked = !value;
      }
    },
    show: function(el, value) {
      return el.style.display = value ? '' : 'none';
    },
    hide: function(el, value) {
      return el.style.display = value ? 'none' : '';
    },
    html: function(el, value) {
      return el.innerHTML = value != null ? value : '';
    },
    value: function(el, value) {
      var o, _i, _len, _ref, _results;
      if (el.type === 'select-multiple') {
        if (value != null) {
          _results = [];
          for (_i = 0, _len = el.length; _i < _len; _i++) {
            o = el[_i];
            _results.push(o.selected = (_ref = o.value, __indexOf.call(value, _ref) >= 0));
          }
          return _results;
        }
      } else {
        return el.value = value != null ? value : '';
      }
    },
    text: function(el, value) {
      if (el.innerText != null) {
        return el.innerText = value != null ? value : '';
      } else {
        return el.textContent = value != null ? value : '';
      }
    }
  };

  Rivets.config = {
    preloadData: true
  };

  Rivets.formatters = {};

  rivets = {
    routines: Rivets.routines,
    formatters: Rivets.formatters,
    config: Rivets.config,
    configure: function(options) {
      var property, value;
      if (options == null) {
        options = {};
      }
      for (property in options) {
        value = options[property];
        Rivets.config[property] = value;
      }
    },
    bind: function(el, models) {
      var view;
      if (models == null) {
        models = {};
      }
      view = new Rivets.View(el, models);
      view.bind();
      return view;
    }
  };

  if (typeof module !== "undefined" && module !== null) {
    module.exports = rivets;
  } else {
    this.rivets = rivets;
  }

}).call(this);
// Generated by CoffeeScript 1.3.3
(function() {
  var swear,
    __slice = [].slice;

  swear = function() {
    var p;
    return p = {
      efns: [],
      fns: [],
      completed: false,
      wrap: function() {
        return function() {
          var d, e;
          e = arguments[0], d = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          if (e != null) {
            return p.abort(e);
          }
          return p.resolve.apply(p, d);
        };
      },
      resolve: function() {
        var cb, val, _i, _len, _ref;
        val = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        p.val = val;
        p.completed = true;
        _ref = p.fns;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cb = _ref[_i];
          cb.apply(null, val);
        }
        return p;
      },
      abort: function(e) {
        var cb, _i, _len, _ref;
        p.err = e;
        p.completed = true;
        _ref = p.efns;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cb = _ref[_i];
          cb(e);
        }
        return p;
      },
      fail: function(cb) {
        if (p.err) {
          cb(p.err);
        } else {
          p.efns.push(cb);
        }
        return p;
      },
      when: function(cb) {
        if (p.val) {
          cb.apply(null, p.val);
        } else {
          p.fns.push(cb);
        }
        return p;
      }
    };
  };

  swear.join = function() {
    var arr, handle, n, p, promises, _i, _len;
    promises = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    arr = [];
    n = swear();
    handle = function() {
      var d, next;
      d = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      next = promises.pop();
      if (!next) {
        return n.resolve.apply(n, arr);
      }
      return next.when(function() {
        var a;
        a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        arr.push(a);
        return handle.apply(null, a);
      });
    };
    for (_i = 0, _len = promises.length; _i < _len; _i++) {
      p = promises[_i];
      p.fail(n.abort);
    }
    handle();
    return n;
  };

  if (typeof module !== "undefined" && module !== null) {
    module.exports = swear;
  } else {
    window.swear = swear;
  }

}).call(this);// Generated by CoffeeScript 1.3.3
(function() {
  var hash, hashTimer, rooter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  hash = {
    lastHash: null,
    listeners: [],
    listen: function(fn) {
      return rooter.hash.listeners.push(fn);
    },
    trigger: function(hash) {
      var fn, _i, _len, _ref;
      if (hash == null) {
        hash = rooter.hash.value();
      }
      rooter.hash.lastHash = hash;
      _ref = rooter.hash.listeners;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        fn = _ref[_i];
        fn(hash);
      }
    },
    value: function(h) {
      if (h) {
        window.location.hash = h;
      }
      hash = window.location.hash.replace('#', '');
      if (hash === "") {
        hash = "/";
      }
      return hash;
    }
  };

  hashTimer = {};

  __extends(hashTimer, hash);

  hashTimer.value = function(h) {
    if (h) {
      rooter.hash.lastHash = h;
      window.location.hash = h;
    }
    return window.location.hash.replace('#', '');
  };

  hashTimer.check = function() {
    var currHash;
    currHash = rooter.hash.value();
    if (currHash !== rooter.hash.lastHash) {
      rooter.hash.trigger(currHash);
    }
    setTimeout(rooter.hash.check, 100);
  };

  rooter = {
    lastMatch: null,
    routes: [],
    route: function(expr, fn) {
      var currHash, o, pattern;
      pattern = "^" + expr + "$";
      pattern = pattern.replace(/([?=,\/])/g, '\\$1').replace(/:([\w\d]+)/g, '([^/]*)');
      o = {
        route: expr,
        names: expr.match(/:([\w\d]+)/g),
        pattern: new RegExp(pattern),
        fn: fn
      };
      rooter.routes.push(o);
      currHash = rooter.hash.value();
      if (rooter.isMatch(currHash, o)) {
        rooter.triggerMatch(currHash, o);
      }
      return rooter;
    },
    isMatch: function(hash, r) {
      return r.pattern.exec(hash) != null;
    },
    triggerMatch: function(hash, r) {
      var args, idx, name, o, _i, _len, _ref;
      rooter.lastMatch = hash;
      o = {};
      if (r.names) {
        args = r.pattern.exec(hash).slice(1);
        _ref = r.names;
        for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
          name = _ref[idx];
          o[name.substring(1)] = args[idx];
        }
      }
      r.fn(o);
    },
    matches: function(hash) {
      var r, _i, _len, _ref, _results;
      _ref = rooter.routes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        r = _ref[_i];
        if (rooter.isMatch(hash, r)) {
          _results.push(r);
        }
      }
      return _results;
    },
    test: function(hash) {
      var match, matches, _i, _len;
      matches = rooter.matches(hash);
      if (!(matches.length > 0)) {
        return;
      }
      for (_i = 0, _len = matches.length; _i < _len; _i++) {
        match = matches[_i];
        rooter.triggerMatch(hash, match);
      }
    }
  };

  if (typeof window.onhashchange !== 'undefined') {
    rooter.hash = hash;
    window.onhashchange = function() {
      return rooter.hash.trigger(rooter.hash.value());
    };
  } else {
    rooter.hash = hashTimer;
    setTimeout(rooter.hash.check, 100);
  }

  rooter.hash.listen(rooter.test);

  if (rooter.hash.check) {
    rooter.hash.check();
  }

  window.rooter = rooter;

}).call(this);
// Generated by CoffeeScript 1.3.3
(function() {
  var k, v, _ref,
    __slice = [].slice;

  window.dermis = {
    stack: [],
    use: function(fn) {
      return dermis.stack.push(fn);
    },
    runStack: function(mod, args, cb) {
      var idx, next;
      if (dermis.stack.length === 0) {
        return cb();
      }
      idx = -1;
      next = function() {
        var nex;
        nex = dermis.stack[++idx];
        if (nex == null) {
          return cb();
        }
        return nex(mod, args, next);
      };
      next();
    },
    current: null,
    cache: {},
    handleRoute: function(service) {
      if (!dermis.cache[service]) {
        dermis.cache[service] = swear();
        require([service], function(srv) {
          var mod, _ref;
          if ((_ref = srv.name) == null) {
            srv.name = service;
          }
          mod = mixer.create().extend(srv);
          if (!mod.init) {
            return dermis.cache[service].resolve(mod);
          }
          mod.on('ready', function() {
            return dermis.cache[service].resolve(mod);
          });
          mod.emit('loading');
          return mod.init();
        });
      }
      return function(args) {
        if (!dermis.cache[service].completed) {
          dermis.emit('preshow', dermis.cache[service]);
        }
        return dermis.cache[service].when(function(mod) {
          return dermis.runStack(mod, args, function() {
            var _ref, _ref1;
            if ((_ref = dermis.current) != null) {
              if (typeof _ref.hide === "function") {
                _ref.hide();
              }
            }
            if ((_ref1 = dermis.current) != null) {
              _ref1.emit('hide');
            }
            mod.show(args);
            mod.emit('show');
            return dermis.current = mod;
          });
        });
      };
    },
    rivetsAdapter: {
      subscribe: function(obj, kp, cb) {
        return obj.on((kp !== "" ? "change:" + kp : "change"), cb);
      },
      unsubscribe: function(obj, kp, cb) {
        return obj.off((kp !== "" ? "change:" + kp : "change"), cb);
      },
      read: function(obj, kp) {
        return obj.get(kp);
      },
      publish: function(obj, kp, val) {
        return obj.set(kp, val);
      }
    },
    rivetsFormatters: {
      exists: function(v) {
        return v != null;
      },
      overZero: function(v) {
        return v > 0;
      },
      length: function(v) {
        if (v != null) {
          return v.length;
        } else {
          return 0;
        }
      }
    },
    modelPreset: {
      bind: function(el) {
        return dermis.bind(el, this);
      }
    },
    collectionPreset: {
      push: function() {
        var item, items, _i, _len,
          _this = this;
        items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          if ((item != null ? item.on : void 0) != null) {
            item.on('change', function() {
              return _this.emit('change:items');
            });
          }
        }
        return this.set('items', this.get('items').concat(items));
      }
    },
    route: function(url, service) {
      var base, _ref, _ref1;
      base = (url === '/' ? 'index' : ((_ref = /\/(.*?)\//.exec(url)) != null ? _ref[1] : void 0) || ((_ref1 = /\/(.*)/.exec(url)) != null ? _ref1[1] : void 0));
      if (service == null) {
        service = "routes/" + base;
      }
      rooter.route(url, dermis.handleRoute(service));
    },
    model: function(o) {
      return mixer.create().extend(dermis.modelPreset).extend(o);
    },
    collection: function(o) {
      return mixer.create().extend(dermis.modelPreset).extend(dermis.collectionPreset).set('items', []).extend(o);
    },
    bind: function(el, model) {
      rivets.configure({
        adapter: dermis.rivetsAdapter
      });
      return rivets.bind(el, model);
    }
  };

  _ref = dermis.rivetsFormatters;
  for (k in _ref) {
    v = _ref[k];
    rivets.formatters[k] = v;
  }

  mixer.extend(dermis, mixer);

}).call(this);
