// Folder schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash'),    
    q = require('q'),
    Item = require('./item');

var FolderSchema = new Schema({
    //Generic fields
    label: {type: String, trim: true }, //name of this folder
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
    //If it has no label we use the id as a label
    var label = this.label || this._id;
    return this.isRoot() ? label : this.path + '/' + label;
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

FolderSchema.statics.updateFoldersPath = function(user,  oldPath, newPath, deltaFolders) {
    var promises = [];
    Folder.findAllDescendant(user, oldPath).then(function(folders) {
        _.each(folders, function(folder){            
            if(folder.path.indexOf(oldPath) === 0) {                
                folder.path = (newPath + folder.path.substring(oldPath.length));   
                deltaFolders.data.push(folder);
            }
            //TODO: else log an error because query failed
            promises.push(folder.saveWithPromise())
        });
    });
    return q.all(promises);
}



FolderSchema.statics.removeFolderAndDescendants = function(user, folder, deltaFolders, deltaItems) {
    return Folder.findAllDescendant(user, folder.fullPath)
        .then(function(folders) {   
            var folderIds = [];
            folders.push(folder);
            _.each(folders, function(folder) {
                deltaFolders.data.push(folder);              
                folderIds.push(folder._id);
            })
            return Item.removeAllByFolders(user, folderIds, deltaItems)
                .then(function() {
                    return q.all(_.map(folders, function(folder) {
                        return folder.removeWithPromise();
                    }));
                });
        })
}

var qfindOne = function (obj) {
  return Folder.findOne(obj).execWithPromise();
};

FolderSchema.statics.by = qfindOne;

module.exports = Folder = mongoose.model('Folder', FolderSchema);
