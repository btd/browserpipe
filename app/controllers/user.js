var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),  
    User = mongoose.model('User'),
    Tag = mongoose.model('Tag'),
    Dashboard = mongoose.model('Dashboard')


//Init
exports.init = function (req, res) {
  if(req.isAuthenticated()){
    if(req.user.currentDashboard)              
      res.redirect('/dashboards/' + req.user.currentDashboard._id)
    else 
      res.redirect('/dashboards') //No dashboard        
   }      
 else
   res.render('main/index')     
}


//Login form
exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login'
  })
}

//Sign up form
exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up'
  })
}

//Logout
exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

//User just logged in
exports.session = function (req, res) {  
  res.redirect('/')
}

//Create user
exports.create = function (req, res) {
  var user = new User(req.body)
  user.provider = 'local' //for passport

  //Creates initial data
  //Root tags
  var tagsTag           = new Tag({ label: 'Tags',    user: user })
  var trashTag          = new Tag({ label: 'Trash',   user: user })
  var importsTag        = new Tag({ label: 'Imports', user: user })

  //Create tags  
  var readLaterTag      = new Tag({ label: "Read Later", path: tagsTag.label, user: user})
  var coolSitesTag      = new Tag({ label: "Cool Sites", path: tagsTag.label, user: user})

  //Create imports tags  
  var fileImports       = new Tag({ label: "File",       path: importsTag.label, user: user})
  var twitterImports    = new Tag({ label: "Twitter",    path: importsTag.label, user: user})
  var facebookImports   = new Tag({ label: "Facebook",   path: importsTag.label, user: user})
  var deliciousImports  = new Tag({ label: "Delicious",  path: importsTag.label, user: user})
  var pinboardImports   = new Tag({ label: "Pinboard",   path: importsTag.label, user: user})

  //Create dashboard
  var dashboard = new Dashboard({ label: 'My initial dashboard', user: user})
    .addContainerByTag(readLaterTag)
    .addContainerByTag(coolSitesTag);
    
  //Sets current dashboard to recently created one
  user.currentDashboard = dashboard

  //TODO: manage rollback
  q.all([
    user.saveWithPromise(),
    tagsTag.saveWithPromise(),
    trashTag.saveWithPromise(),
    importsTag.saveWithPromise(),
    readLaterTag.saveWithPromise(),
    coolSitesTag.saveWithPromise(),
    fileImports.saveWithPromise(),
    twitterImports.saveWithPromise(),
    facebookImports.saveWithPromise(),
    deliciousImports.saveWithPromise(), 
    pinboardImports.saveWithPromise(),
    dashboard.saveWithPromise()
  ])
  .spread(function(){
    req.login(user, function(err) {
      if (err) return res.render('500')
      return res.redirect('/dashboards/' + dashboard.id)
    })
  }, function(err){
    console.warn(err);
    res.render('users/signup', { errors: err.errors })
  }).done()  
}

/*//Show profile
exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
    title: user.name,
    user: user
  })
}*/

//Find user by id
exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .populate('currentDashboard')
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}