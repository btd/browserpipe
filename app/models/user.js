// User schema

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt'),
  _ = require('lodash'),
  bcryptRounds = 10,
  validation = require('./validation');

var UserSchema = new Schema({
    name: { type: String, match: /(\w| )+/, trim: true, validate: validation.nonEmpty}
  , email: { type: String, required: true, match: /\S+@\S+\.\S/, errMsg: 'Email is not valid', trim: true, lowercase: true, validate: validation.nonEmpty, unique: true }
  , username: { type: String, match: /\w+/, validate: validation.nonEmpty }
  , password: {type: String, set: function(password) {
    //do not allow user to set empty password
    return _.isEmpty(password)? undefined : bcrypt.hashSync(password, bcryptRounds);
  }, required: true}
});

// methods
/*UserSchema.method('verifyPassword', function(password, callback) {
  bcrypt.compare(password, this.password, callback);
});*/

UserSchema.method('authenticate', function(password) {
  return bcrypt.compareSync(password, this.password);
})

/*UserSchema.static('authenticate', function(email, password, callback) {
  this.findOne({ email: email }, function(err, user) {
      if (err) { return callback(err); }
      if (!user) { return callback(null, false); }
      user.verifyPassword(password, function(err, passwordCorrect) {
        if (err) { return callback(err); }
        if (!passwordCorrect) { return callback(null, false); }
        return callback(null, user);
      });
    });
});
*/
module.exports = mongoose.model('User', UserSchema);
