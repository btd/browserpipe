// Folder schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash');

var Folder;

var FolderSchema = new Schema({
    //Generic fields
    label: {type: String, trim: true }, //name of this folder
    path: {type: String, trim: true, default: ''}, //name of parent folder, default set to '' that if we will create index by this field, we do not create sparse index
    user: {type: Schema.ObjectId, ref: 'User'},
    index: {type: Number, required: true, default: 0},
    items: [
        {type: Schema.ObjectId, ref: 'Item'}
    ]
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
    //If it has no label we use the id as a label
    var label = this.label || this._id;
    return this.isRoot() ? label : this.path + '/' + label;
})

FolderSchema.statics.byId = function (id) {
    return qfindOne({ _id: id});
}

FolderSchema.statics.getAll = function (user) {
    return this
        .find({user: user}, '_id label path items')
        //.populate('user', 'label', 'path')
        .sort({'path': 1}) // sort by path
        // .limit(perPage)
        // .skip(perPage * page)
        .execWithPromise();
}

FolderSchema.statics.findAllByPath = function (user, path) {
    return this
        .find({user: user, path: path }, 'user label path items')
        .sort({'path': 1}) // sort by path
        // .limit(perPage)
        // .skip(perPage * page)
        .execWithPromise();
}

FolderSchema.statics.findAllDescendant = function (user, path) {
    return this
        .find({user: user, path: new RegExp("^" + path)}, 'user label path items')
        .sort({'path': 1}) 
        .execWithPromise();
}

FolderSchema.methods.addItemId = function (itemId) {
    this.items.push(itemId);
    return this;
};

FolderSchema.methods.removeItemId = function (itemId) {
    this.items.remove(itemId);
    return this;
};

var qfindOne = function (obj) {
  return Folder.findOne(obj).execWithPromise();
};

FolderSchema.statics.by = qfindOne;

module.exports = Folder = mongoose.model('Folder', FolderSchema);
