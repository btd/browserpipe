// Tag schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validation = require('./validation'),
    _ = require('lodash'),
    q = require('q')

var TagSchema = new Schema({
    label: {type: String, trim: true, validate: validation.nonEmpty}, //name of this tag
    path: {type: String, trim: true, default: ''}, //name of parent tag, default set to '' that if we will create index by this field, we do not create sparse index
    user: {type: Schema.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now}
});

TagSchema.path('label').validate(function (label) {
    return label.length > 0
}, 'Tag label cannot be blank')

TagSchema.methods.saveWithPromise = function () {
    var deferred = q.defer();
    this.save(function (err) {
        if (err) deferred.reject(err)
        else deferred.resolve()
    })
    return deferred.promise;
}

TagSchema.methods.isRoot = function () {
    return _.isEmpty(this.path);
};

TagSchema.methods.createChildTag = function (tagLabel) {
    var Tag = this.model('Tag');

    return new Tag({ user: this.user, label: tagLabel, path: this.fullPath });
}

//TODO it should take all parents tag!!!
TagSchema.virtual('fullPath').get(function () {
    return this.isRoot() ? this.label : this.path + '/' + this.label;
})

TagSchema.statics.getAll = function (user) {
    var deferred = q.defer();
    this
        .find({user: user}, '_id label path')
        //.populate('user', 'label', 'path')
        .sort({'path': 1}) // sort by path
        // .limit(perPage)
        // .skip(perPage * page)
        .exec(function (err, tags) {
            // TODO manage errors propertly
            if (err) error(err)
            else deferred.resolve(tags)
        })
    return deferred.promise;
}


//POSIBLE NEEDED FILTER TAG FUNCTIONS FOR THE FUTURE WHEN THEY ARE NOT ALL HOLD IN MEMORY IN THE CLIENT

TagSchema.statics.getChildrenByPath = function (user, path, success, error) {
    this
        .find({user: user, path: path })
        //.populate('user', 'label', 'path')
        .sort({'path': 1}) // sort by date
        // .limit(perPage)
        // .skip(perPage * page)
        .exec(function (err, tags) {
            // TODO manage errors propertly
            if (err) error(err)
            else success(tags)
        })
}
TagSchema.statics.getTagAndChildrenByPath = function (user, parentPath, path, success, error) {
    this
        .find({user: user, path: { $in: [path, parentPath] } })
        //.populate('user', 'label', 'path')
        .sort({'path': 1}) // sort by date
        // .limit(perPage)
        // .skip(perPage * page)
        .exec(function (err, tags) {
            // TODO manage errors propertly
            if (err) error(err)
            else success(tags)
        })
}
TagSchema.statics.getAllDescendantByPath = function (user, path, success, error) {
    this
        .find({user: user, path: new RegExp("^" + path) })
        //.populate('user', 'label', 'path')
        .sort({'path': 1}) // sort by date
        // .limit(perPage)
        // .skip(perPage * page)
        .exec(function (err, tags) {
            // TODO manage errors propertly
            if (err) error(err)
            else success(tags)
        })
}

mongoose.model('Tag', TagSchema);
