// User schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash'),
    validation = require('./validation');

var User;

var bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var errorMsgs = {
    invalid: 'is not valid',
    should_be_unique: 'already used'
}

var ListboardSchema = require('./listboard');

var UserSchema = new Schema({
    name: { type: String, match: /(\w| )+/, trim: true, validate: validation.nonEmpty("Name ")},
    email: { type: String, required: true, validate: [ /\S+@\S+\.\S/, errorMsgs.invalid], trim: true, lowercase: true},
    password: { type: String, required: true},
    listboards: [ ListboardSchema ]
});

UserSchema.plugin(require('../util/mongoose-timestamp'));

//http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // hash the password
    bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
});

UserSchema.methods.authenticate = function (password, callback) {
    return bcrypt.compare(password, this.password, callback);
};

// 2 convinient wrappers to do not repeat in code also it populate internal doc
UserSchema.statics.byId = function (id) {
    return qfindOne({ _id: id});
};

UserSchema.statics.byEmail = function (email) {
    return qfindOne({ email: email.toLowerCase() });
};

UserSchema.pre('save', function (done) {
    var that = this;
    User.byEmail(this.email)
        .then(function (otherUser) {
            if (otherUser && !otherUser._id.equals(that._id)) {
                that.invalidate('email', errorMsgs.should_be_unique);
                done(new Error(errorMsgs.should_be_unique));
            } else {
                done();
            }
        }).fail(function (err) {
            done(err);
        });
});

var qfindOne = function (obj) {
    return User.findOne(obj).execWithPromise();
};

UserSchema.statics.by = qfindOne;


UserSchema.methods.getListboardByBrowserKey = function (key) {
    var result = _.filter(this.listboards, function( listboard ){ return listboard.browserKey === key; });
    if (result.length === 1)
        return result[0];
    else if (result.length === 0)
        return null
    else if (result.length > 1)
        throw "Cannot be two listboards with same browser key"
}

UserSchema.methods.addListboard = function (rawListboard) {
    this.listboards.push(rawListboard);
    return _.last(this.listboards);
}

UserSchema.methods.removeListboard = function (listboard) {
    this.listboards.id(listboard).remove();
    return this;
};

module.exports = User = mongoose.model('User', UserSchema);
