// User schema

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt'),
  _ = require('lodash'),
  authTypes = ['twitter', 'facebook', 'google'],
  bcryptRounds = 10;

var UserSchema = new Schema({
    name: String
  , email: String
  , username: String
  , password: {type: String, set: function(password) {
    //do not allow user to set empty password
    return _.isEmpty(password)? undefined : bcrypt.hashSync(password, bcryptRounds);
  }}
  , provider: String
  , facebook: {}
  , twitter: {}
  , google: {}
});

// the below 4 validations only apply if you are signing up traditionally

UserSchema.path('name').validate(function (name) {
  // if you are authenticating by any of the oauth strategies, don't validate
  return authTypes.indexOf(this.provider) !== -1 ? true : !_.isEmpty(name);
}, 'Name cannot be blank');

UserSchema.path('email').validate(function (email) {
  // if you are authenticating by any of the oauth strategies, don't validate
  return authTypes.indexOf(this.provider) !== -1 ? true : !_.isEmpty(email);
}, 'Email cannot be blank');

UserSchema.path('username').validate(function (username) {
  // if you are authenticating by any of the oauth strategies, don't validate
  return authTypes.indexOf(this.provider) !== -1 ? true : !_.isEmpty(username);
}, 'Username cannot be blank');

// methods
UserSchema.method('authenticate', function(password) {
  return bcrypt.compareSync(password, this.password);
});

UserSchema.method('isExternal', function() {
  return authTypes.indexOf(this.provider) !== -1;
});

//this check need because mongoose do not validate undefined fields
UserSchema.pre('save', function (next) {
  if(!this.isExternal() && 
      (_.isEmpty(this.password) || _.isEmpty(this.username) || _.isEmpty(this.email) || _.isEmpty(this.name))) {
    next(new Error('Not social user should have name, username, email, password'));
  } else {
    next();
  }
});

exports.User = mongoose.model('User', UserSchema);
