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