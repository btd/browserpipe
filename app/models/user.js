// User schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    _ = require('lodash'),
    bcryptRounds = 10,
    validation = require('./validation'),
    q = require('q');

var errorMsgs = {
    invalid: 'is not valid',
    should_be_unique: 'already used'
}

var ListboardSchema = require('./listboard');

var UserSchema = new Schema({
    name: { type: String, match: /(\w| )+/, trim: true, validate: validation.nonEmpty("Name ")},
    email: { type: String, required: true, validate: [ /\S+@\S+\.\S/, errorMsgs.invalid], trim: true, lowercase: true},
    password: {type: String, set: function (password) {
        //do not allow user to set empty password
        return _.isEmpty(password) ? undefined : bcrypt.hashSync(password, bcryptRounds);
    }, required: true},
    listboards: [ ListboardSchema ]
});

UserSchema.plugin(require('../util/mongoose-timestamp'));

UserSchema.methods.authenticate = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.addListboard = function (rawListboard) {
    this.listboards.push(rawListboard);
    return _.last(this.listboards);
}

UserSchema.methods.getContainersByFolderIds = function (folderIds) {
    return _.chain(this.listboards)
                .map(function (listboard) { return listboard.containers})
                .flatten()
                .filter(function(container) {
                    return _.contains(folderIds, container.folder.toString()) 
                })
                .value();
};

UserSchema.methods.removeContainersByFolderIds = function (folderIds) {
    _.map(this.listboards, function (listboard) {                     
        var containersToRemove =  _.chain(listboard.containers)
            .filter(function(container) {                
                return _.contains(folderIds, container.folder.toString()) 
            })
            .value();
        _.map(containersToRemove, function(container) {
            listboard.containers.remove(container);    
        });
    });
    return this.saveWithPromise();
};


// 2 convinient wrappers to do not repeat in code also it populate internal doc
UserSchema.statics.byId = function (id) {
    return qfindOne({ _id: id});
};

UserSchema.statics.byEmail = function (email) {
    return qfindOne({ email: email});
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

module.exports = User = mongoose.model('User', UserSchema);
