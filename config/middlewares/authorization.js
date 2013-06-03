
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

//TODO it is good to have one middleware that will redirect to login if not authorized and if it is then redirect to required url


/*
 *  User authorizations routing middleware
 */
/*exports.user = {
    hasAuthorization : function (req, res, next) {
      if (req.profile.id != req.user.id) {
        return res.redirect('/users/'+req.profile.id)
      }
      next()
    }
}*/


/*
 *  Tag authorizations routing middleware
 */
/*exports.tag = {
    hasAuthorization : function (req, res, next) {
      if (req.tag.user.id != req.user.id) {
        return res.redirect('/articles/'+req.tag.id)
      }
      next()
    }
}
*/