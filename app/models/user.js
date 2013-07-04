// User schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    _ = require('lodash'),
    bcryptRounds = 10,
    validation = require('./validation'),
    Q = require('q');

var errorMsgs = {
    invalid: 'is not valid',
    should_be_unique: 'already used'
}

var UserSchema = new Schema({
    name: { type: String, match: /(\w| )+/, trim: true, validate: validation.nonEmpty},
    email: { type: String, required: true, validate: [ /\S+@\S+\.\S/, errorMsgs.invalid], trim: true, lowercase: true},
    password: {type: String, set: function (password) {
        //do not allow user to set empty password
        return _.isEmpty(password) ? undefined : bcrypt.hashSync(password, bcryptRounds);
    }, required: true},
    currentDashboard: {type: Schema.ObjectId, ref: 'Dashboard'}
});

UserSchema.plugin(require('mongoose-timestamp'));

UserSchema.methods.authenticate = function (password) {
    return bcrypt.compareSync(password, this.password);
}

// 2 convinient wrappers to do not repeat in code also it populate internal doc
UserSchema.statics.byId = function (id) {
    return qfindOne({ _id: id});
}

UserSchema.statics.byEmail = function (email) {
    return qfindOne({ email: email});
}

UserSchema.pre('save', function (done) {
    User.byEmail(this.email)
        .then(function (otherUser) {
            if (otherUser) {
                this.invalidate('email', errorMsgs.should_be_unique);
                done(new Error(errorMsgs.should_be_unique));
            } else {
                done();
            }
        }).fail(function (err) {
            done(err);
        });

});

var qfindOne = function (obj) {
    return User.findOne(obj).populate('currentDashboard').execWithPromise();
};

module.exports = User = mongoose.model('User', UserSchema);
