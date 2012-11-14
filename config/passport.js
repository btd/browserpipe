var mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  //, TwitterStrategy = require('passport-twitter').Strategy
  //, FacebookStrategy = require('passport-facebook').Strategy
  //, GoogleStrategy = require('passport-google-oauth').Strategy
  , User = mongoose.model('User')


exports.boot = function (passport, config) {
  // require('./initializer')

  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user)
    })
  })

  // use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({ email: email }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {
          return done(null, false, { message: 'Unknown user' })
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'Invalid password' })
        }
        return done(null, user)
      })
    }
  ))
/*
  // use twitter strategy
  passport.use(new TwitterStrategy({
        consumerKey: config.twitter.consumerKey
      , consumerSecret: config.twitter.consumerSecret
      , callbackURL: config.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      User.findOne({ 'twitter.id': profile.id }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {
          user = new User({
              name: profile.displayName
            , username: profile.username
            , provider: 'twitter'
            , twitter: profile._json
          })
          user.save(function (err, user) {
            if (err) console.log(err)
            return done(err, user)
          })
        }
        else {
          return done(err, user)
        }
      })
    }
  ))

  // use facebook strategy
  passport.use(new FacebookStrategy({
        clientID: config.facebook.appId
      , clientSecret: config.facebook.appSecret
      , callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ 'facebook.id': profile.id }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {
          user = new User({
              name: profile.displayName
            , email: profile.emails[0].value
            , username: profile.username
            , provider: 'facebook'
            , facebook: profile._json
          })
          user.save(function (err, user) {
            if (err) console.log(err)
            return done(err, user)
          })
        }
        else {
          return done(err, user)
        }
      })
    }
  ))

  // use google strategy
  passport.use(new GoogleStrategy({
      consumerKey: config.google.clientID,
      consumerSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ 'google.id': profile.id }, function (err, user) {
        if (!user) {
          user = new User({
              name: profile.displayName
            , email: profile.emails[0].value
            , username: profile.username
            , provider: 'google'
            , google: profile._json
          })
          user.save()
        }
        return done(err, user)
      })
    }
  ));*/
}