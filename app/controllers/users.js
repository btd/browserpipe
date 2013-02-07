var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Tag = mongoose.model('Tag')
  , Dashboard = mongoose.model('Dashboard')

exports.signin = function (req, res) {}

// auth callback
exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

// login
exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login'
  })
}

// sign up
exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up'
  })
}

// logout
exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

// session
exports.session = function (req, res) {
  res.redirect('/')
}

// signup
exports.create = function (req, res) {
  var user = new User(req.body)
  user.provider = 'local'
  //create initial Dashboard
  var dashboard = new Dashboard({label: 'My initial dashboard', user: user})      
  dashboard.save()
  //sets initial dashboard as current
  user.currentDashboard = dashboard
  user.save(function (err) {
    if (err) return res.render('users/signup', { errors: err.errors })     

    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect('/')
    })
  })
}

exports.init = function (req, res) {
  if(req.isAuthenticated()){
        //Load inline the root tag
        //TODO: add intelligent loading logic. Such as the whole tree but where order < 50 (50 childs per tag)
        Tag.getAll(req.user, function(tags){
          res.render('main/home', {user: req.user, tags: tags})
        }, function(){
          res.render('500')
        })        
      }      
    else
      res.render('main/index')
}

// show profile
exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
      title: user.name
    , user: user
  })
}
