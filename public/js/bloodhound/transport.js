/*
 * typeahead.js
 * https://github.com/twitter/typeahead.js
 * Copyright 2013-2014 Twitter, Inc. and other contributors; Licensed MIT
 */

var LruCache = require('./lru-cache');
var send = require('../send');

var pendingRequestsCount = 0,
  pendingRequests = {},
  maxPendingRequests = 6,
  requestCache = new LruCache(10);

// constructor
// -----------

function Transport(o) {
  o = o || {};

  this._send = send;
  this._get = o.rateLimiter ? o.rateLimiter(this._get) : this._get;
}

// static methods
// --------------

Transport.setMaxPendingRequests = function setMaxPendingRequests(num) {
  maxPendingRequests = num;
};

Transport.resetCache = function clearCache() {
  requestCache = new LruCache(10);
};

// instance methods
// ----------------

Transport.prototype = {

  // ### private

  _get: function (url, o, cb) {
    var that = this, r = pendingRequests[url];
    o.url = url;

    // a request is already in progress, piggyback off of it
    if (r) {
      r.then(done, fail);
    }
    // under the pending request threshold, so fire off a request
    else if (pendingRequestsCount < maxPendingRequests) {
      pendingRequestsCount++;
      pendingRequests[url] =
        this._send(o).then(done, fail).then(always);
    }

    // at the pending request threshold, so hang out in the on deck circle
    else {
      this.onDeckRequestArgs = [].slice.call(arguments, 0);
    }

    function done(resp) {
      cb && cb(null, resp);
      requestCache.set(url, resp);
    }

    function fail() {
      cb && cb(true);
    }

    function always() {
      pendingRequestsCount--;
      delete pendingRequests[url];

      // ensures request is always made for the last query
      if (that.onDeckRequestArgs) {
        that._get.apply(that, that.onDeckRequestArgs);
        that.onDeckRequestArgs = null;
      }
    }
  },

  // ### public

  get: function (url, o, cb) {
    var resp;

    if (typeof o == 'function') {
      cb = o;
      o = {};
    }

    // in-memory cache hit
    if (resp = requestCache.get(url)) {
      // defer to stay consistent with behavior of ajax call
      setTimeout(function () {
        cb && cb(null, resp);
      }, 0);
    }

    else {
      this._get(url, o, cb);
    }

    // return bool indicating whether or not a cache hit occurred
    return !!resp;
  }
};

module.exports = Transport;
