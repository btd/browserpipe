// User schema

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt'),
  _ = require('lodash'),
  bcryptRounds = 10;

var nonEmpty = function(value) {
  return value !== '';
};

var UserSchema = new Schema({
    name: { type: String, match: /(\w| )+/, trim: true, validate: [nonEmpty, 'nonEmpty']}
  , email: { type: String, required: true, match: /\S+@\S+\.\S/, errMsg: 'Email is not valid', trim: true, lowercase: true, validate: [nonEmpty, 'nonEmpty'] }
  , username: { type: String, match: /\w+/, validate: [nonEmpty, 'nonEmpty'] }
  , password: {type: String, set: function(password) {
    //do not allow user to set empty password
    return _.isEmpty(password)? undefined : bcrypt.hashSync(password, bcryptRounds);
  }}
  , firstLogin: {type : Boolean, default : true}
  , currentDashboard: {type : Schema.ObjectId, ref : 'Dashboard'}
});

// methods
UserSchema.method('authenticate', function(password) {
  return bcrypt.compareSync(password, this.password);
});

exports.User = mongoose.model('User', UserSchema);
