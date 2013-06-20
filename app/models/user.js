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
    password: {type: String, set: function (password) {
        //do not allow user to set empty password
        return _.isEmpty(password) ? undefined : bcrypt.hashSync(password, bcryptRounds);
    }, required: true},
    currentDashboard: {type: Schema.ObjectId, ref: 'Dashboard'}
});

UserSchema.methods.authenticate = function (password) {
    return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.saveWithPromise = function () {
    var deferred = q.defer();
    this.save(function (err) {
        if (err) deferred.reject(err)
        else deferred.resolve()
    })
    return deferred.promise;
}

// 2 convinient wrappers to do not repeat in code also it populate internal doc
UserSchema.statics.byId = function (id, callback) {
    mongoose.model('User').findOne({ _id: id }).populate('currentDashboard').exec(callback);
}

UserSchema.statics.byEmail = function (email, callback) {
    mongoose.model('User').findOne({ email: email }).populate('currentDashboard').exec(callback);
}

mongoose.model('User', UserSchema)
