
module.exports.redirectIfNotAuthenticated = function(redirectUrl) {
  return function(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect(redirectUrl)
    }
    next()
  }
};

var common401Error = {code: 401, message: 'Not authorized'};

module.exports.send401IfNotAuthenticated = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.format({
      
      html: function(){
        res.send(common401Error.code, common401Error.message);
      },
      
      json: function(){
        res.json(common401Error.code, common401Error);
      }
    });
  } else {
    next()
  }
};
// This thing uses returnTo that passport.js understand and redirect after successfull login
module.exports.ensureLoggedIn = function (options) {
    if (typeof options == 'string') {
        options = { redirectTo: options }
    }
    options = options || {};

    var url = options.redirectTo || '/login';
    var setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;

    return function(req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            if (setReturnTo && req.session) {
                req.session.returnTo = req.originalUrl || req.url;
            }
            return res.redirect(url);
        }
        next();
    }
}
