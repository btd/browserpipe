// Folder schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validation = require('./validation'),
    _ = require('lodash'),
    q = require('q')

var FolderSchema = new Schema({
    //Generic fields
    label: {type: String, trim: true, validate: validation.nonEmpty("Label")}, //name of this folder
    path: {type: String, trim: true, default: ''}, //name of parent folder, default set to '' that if we will create index by this field, we do not create sparse index
    user: {type: Schema.ObjectId, ref: 'User'}
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

FolderSchema.plugin(require('../util/mongoose-timestamp'));

FolderSchema.methods.isRoot = function () {
    return _.isEmpty(this.path);
};

FolderSchema.methods.createChildFolder = function (folderLabel) {
    return new Folder({ user: this.user, label: folderLabel, path: this.fullPath });
}

//TODO it should take all parents folder!!!
FolderSchema.virtual('fullPath').get(function () {
    return this.isRoot() ? this.label : this.path + '/' + this.label;
})

FolderSchema.statics.byId = function (id) {
    return qfindOne({ _id: id});
}

FolderSchema.statics.getAll = function (user) {
    return this
        .find({user: user}, '_id label path')
        //.populate('user', 'label', 'path')
        .sort({'path': 1}) // sort by path
        // .limit(perPage)
        // .skip(perPage * page)
        .execWithPromise();
}

FolderSchema.statics.findAllByPath = function (user, path) {
    return this
        .find({user: user, path: path }, 'user label path')
        .sort({'path': 1}) // sort by path
        // .limit(perPage)
        // .skip(perPage * page)
        .execWithPromise();
}

FolderSchema.statics.findAllDescendant = function (user, path) {
    return this
        .find({user: user, path: new RegExp("^" + path)}, 'user label path')
        .sort({'path': 1}) 
        .execWithPromise();
}

var qfindOne = function (obj) {
    return Folder.findOne(obj).execWithPromise();
};

module.exports = Folder = mongoose.model('Folder', FolderSchema);
