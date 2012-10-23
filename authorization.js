
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  next()
};


/*
 *  User authorizations routing middleware
 */

exports.user = {
    hasAuthorization : function (req, res, next) {
      if (req.profile.id != req.user.id) {
        return res.redirect('/users/'+req.profile.id)
      }
      next()
    }
}


/*
 *  Folder authorizations routing middleware
 */

exports.folder = {
    hasAuthorization : function (req, res, next) {
      if (req.folder.user.id != req.user.id) {
        return res.redirect('/articles/'+req.folder.id)
      }
      next()
    }
}
