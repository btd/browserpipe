// User schema

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var User;

var bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;


var UserSchema = new Schema({
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  password: { type: String },

  /*
  For now it is just Accept-Language value header
  it consists from locales like
    name1, name2, ...

    Each name consists from
      locale;q=digit

      where digit by default 1 (can be omitted) and from 0 to 1
  See http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html Paragraph 14.4
   */
  langs: { type: String, default: 'en-US,en;q=0.5' },

  items: [{ type: Schema.ObjectId, ref: 'Item' }]
});

UserSchema.plugin(require('../util/mongoose-timestamp'));
UserSchema.plugin(require('../util/mongoose-query'));
UserSchema.plugin(require('../util/mongoose-patch'));

UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

//http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if(!user.isModified('password')) return next();

  // hash the password
  bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash) {
    if(err) return next(err);

    // override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});

UserSchema.methods.authenticate = function(password, callback) {
  return bcrypt.compare(password, this.password, callback);
};

UserSchema.statics.byEmail = function(email) {
  return User.by({ email: email.toLowerCase() });
};

UserSchema.pre('save', function(done) {
  var that = this;
  return User.byEmail(this.email)
    .then(function(otherUser) {
      if(otherUser && !otherUser._id.equals(that._id)) {
        that.invalidate('email', 'not unique');
        done(new Error('email not unique'));
      } else {
        done();
      }
    }, done);
});

module.exports = User = mongoose.model('User', UserSchema);
