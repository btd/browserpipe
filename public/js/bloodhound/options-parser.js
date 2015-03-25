/*
 * typeahead.js
 * https://github.com/twitter/typeahead.js
 * Copyright 2013-2014 Twitter, Inc. and other contributors; Licensed MIT
 */

var _ = require('./util');

module.exports = {
  local: getLocal,
  prefetch: getPrefetch,
  remote: getRemote
};

function getLocal(o) {
  return o.local || null;
}

function getPrefetch(o) {
  var prefetch = o.prefetch;

  var defaults = {
    url: null,
    thumbprint: '',
    ttl: 24 * 60 * 60 * 1000, // 1 day
    filter: null,
    ajax: {}
  };

  if (prefetch) {
    // support basic (url) and advanced configuration
    prefetch = typeof prefetch == 'string' ? { url: prefetch } : prefetch;

    Object.keys(defaults).forEach(function (key) {
      if (!(key in prefetch)) {
        prefetch[key] = defaults[key];
      }
    });

    prefetch.method = prefetch.method || 'GET';

    if (!prefetch.url) throw new Error('prefetch requires url to be set');
  }

  return prefetch;
}

function getRemote(o) {
  var remote = o.remote;

  var defaults = {
    url: null,
    wildcard: '%QUERY',
    replace: null,
    rateLimitBy: 'debounce',
    rateLimitWait: 300,
    send: null,
    filter: null,
    ajax: {}
  };

  if (remote) {
    // support basic (url) and advanced configuration
    remote = typeof remote == 'string' ? { url: remote } : remote;

    Object.keys(defaults).forEach(function (key) {
      if (!(key in remote)) {
        remote[key] = defaults[key];
      }
    });

    remote.rateLimiter = /^throttle$/i.test(remote.rateLimitBy) ?
      byThrottle(remote.rateLimitWait) : byDebounce(remote.rateLimitWait);

    remote.method = remote.method || 'GET';

    delete remote.rateLimitBy;
    delete remote.rateLimitWait;

    if (!remote.url) throw new Error('remote requires url to be set');
  }

  return remote;

  function byDebounce(wait) {
    return function (fn) {
      return _.debounce(fn, wait);
    };
  }

  function byThrottle(wait) {
    return function (fn) {
      return _.throttle(fn, wait);
    };
  }
}