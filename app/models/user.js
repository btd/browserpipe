// User schema

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt'),
  _ = require('lodash'),
  bcryptRounds = 10,
  validation = require('./validation'),
  q = require('q')

var UserSchema = new Schema({
  name: { type: String, match: /(\w| )+/, trim: true, validate: validation.nonEmpty},
  email: { type: String, required: true, validate: [ /\S+@\S+\.\S/, 'Email is not valid' ], trim: true, lowercase: true, unique: true, validate: validation.nonEmpty},
  password: {type: String, set: function(password) {
    //do not allow user to set empty password
    return _.isEmpty(password)? undefined : bcrypt.hashSync(password, bcryptRounds);
  }, required: true},
  currentDashboard: {type : Schema.ObjectId, ref : 'Dashboard'}
});


UserSchema.pre("save",function(next) {
    var self = this;
    mongoose.models["User"].findOne({email : self.email},function(err, results) {
        if(err) {
            next(err);
        } else if(results) { //there was a result found, so the email address exists
            self.invalidate("email","email must be unique");
            next(new Error("email must be unique"));
        } else {
            next();
        }
    });
    next();
});

// methods
/*UserSchema.method('verifyPassword', function(password, callback) {
  bcrypt.compare(password, this.password, callback);
});*/

UserSchema.method('authenticate', function(password) {
  return bcrypt.compareSync(password, this.password);
})

UserSchema.method('saveWithPromise', function() {
  var deferred = q.defer(); 
  this.save(function (err) {
    if (err) deferred.reject(err)
    else deferred.resolve()    
  })
  return deferred.promise;
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
