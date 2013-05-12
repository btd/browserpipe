var _ = require('lodash'),
  q = require('q'),
  mongoose = require('mongoose'),  
  User = mongoose.model('User'),
  Tag = mongoose.model('Tag'),
  Dashboard = mongoose.model('Dashboard'),
  Container = mongoose.model('Container')


//Init
exports.init = function (req, res) {
  if(req.isAuthenticated()){
    if(req.user.currentDashboard)              
      res.redirect('/dashboards/' + req.user.currentDashboard)
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
  //Create tags  
  var readLaterTag = new Tag({label: "Read Later", path: "Tags", user: user})
  var coolSitesTag = new Tag({label: "Cool Sites", path: "Tags", user: user})
  //Create imports tags  
  var fileImports = new Tag({label: "File", path: "Imports", user: user})
  var twitterImports = new Tag({label: "Twitter", path: "Imports", user: user})
  var facebookImports = new Tag({label: "Facebook", path: "Imports", user: user})
  var deliciousImports = new Tag({label: "Delicious", path: "Imports", user: user})
  var pinboardImports = new Tag({label: "Pinboard", path: "Imports", user: user})
  //Create dashboard
  var dashboard = new Dashboard({label: 'My initial dashboard', user: user})        
  //Create initial containers
  var readLaterContainer = new Container({type: 1, title: "Read Later", filter: "Tags/Read Later", dashboard: dashboard, user: user, order: 0})
  var coolSitesContainer = new Container({type: 1, title: "Cool sites", filter: "Tags/Cool Sites", dashboard: dashboard, user: user, order: 1})
  //Sets current dashboard to recently created one
  user.currentDashboard = dashboard

  //TODO: manage rollback
  q.all([
    readLaterTag.saveWithPromise(),
    coolSitesTag.saveWithPromise(),
    fileImports.saveWithPromise(),
    twitterImports.saveWithPromise(),
    facebookImports.saveWithPromise(),
    deliciousImports.saveWithPromise(), 
    pinboardImports.saveWithPromise(),
    dashboard.saveWithPromise(),
    readLaterContainer.saveWithPromise(),
    coolSitesContainer.saveWithPromise(),
    user.saveWithPromise()])
  .spread(function(){
    req.login(user, function(err) {
      if (err) return res.render('500')
      return res.redirect('/dashboards/' + dashboard.id)
    })
  }, function(err){
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
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}