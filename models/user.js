// User schema

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validation = require('./validation');

var User;

var bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;

var errorMsgs = {
  invalid: 'is not valid',
  should_be_unique: 'already used'
}

var UserSchema = new Schema({
  name: { type: String, match: /(\w| )+/, trim: true, validate: validation.nonEmpty("Name ")},
  email: { type: String, required: true, validate: [ /\S+@\S+\.\S/, errorMsgs.invalid], trim: true, lowercase: true},
  password: { type: String, required: true},

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

  browser: { type: Schema.ObjectId, ref: 'Item' }
});

UserSchema.plugin(require('../util/mongoose-timestamp'));

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

UserSchema.statics.by = function(obj) {
  return User.findOne(obj).exec();
};

// 2 convinient wrappers to do not repeat in code also it populate internal doc
UserSchema.statics.byId = function(id) {
  return User.by({ _id: id});
};

UserSchema.statics.byEmail = function(email) {
  return User.by({ email: email.toLowerCase() });
};

UserSchema.pre('save', function(done) {
  var that = this;
  return User.byEmail(this.email)
    .then(function(otherUser) {
      if(otherUser && !otherUser._id.equals(that._id)) {
        that.invalidate('email', errorMsgs.should_be_unique);
        done(new Error(errorMsgs.should_be_unique));
      } else {
        done();
      }
    }, done);
});

module.exports = User = mongoose.model('User', UserSchema);
