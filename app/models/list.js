// List schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validation = require('./validation'),
    _ = require('lodash'),
    q = require('q')

var ListSchema = new Schema({
    label: {type: String, trim: true, validate: validation.nonEmpty}, //name of this list
    path: {type: String, trim: true, default: ''}, //name of parent list, default set to '' that if we will create index by this field, we do not create sparse index
    user: {type: Schema.ObjectId, ref: 'User'}
});

ListSchema.plugin(require('../util/mongoose-timestamp'));

ListSchema.methods.isRoot = function () {
    return _.isEmpty(this.path);
};

ListSchema.methods.createChildList = function (listLabel) {
    return new List({ user: this.user, label: listLabel, path: this.fullPath });
}

//TODO it should take all parents list!!!
ListSchema.virtual('fullPath').get(function () {
    return this.isRoot() ? this.label : this.path + '/' + this.label;
})

ListSchema.statics.byId = function (id) {
    return qfindOne({ _id: id});
}

ListSchema.statics.getAll = function (user) {
    return this
        .find({user: user}, '_id label path')
        //.populate('user', 'label', 'path')
        .sort({'path': 1}) // sort by path
        // .limit(perPage)
        // .skip(perPage * page)
        .execWithPromise();
}

ListSchema.statics.findChildrenByPath = function (user, path) {
    return this
        .find({user: user, path: path })
        //.populate('user', 'label', 'path')
        .sort({'path': 1}) // sort by date
        // .limit(perPage)
        // .skip(perPage * page)
        .execWithPromise();
}

ListSchema.methods.removeFull = function () {

    return q.spread([
            this.removeChildrenByPath(),
            /*Container.findByFilter(req.user, list.path),
            Items.findByList(req.user, list.path),*/
            this.removeWithPromise()
        ]);
}

ListSchema.methods.removeChildrenByPath = function () {
    return List
        .findChildrenByPath(this.user, this.fullPath)
        .then(function(lists){
            var promises = lists.map(function(childList){ return childList.removeFull() });            
            return q.spread(promises);
        });
}

/* Not used
ListSchema.statics.getListAndChildrenByPath = function (user, parentPath, path, success, error) {
    this
        .find({user: user, path: { $in: [path, parentPath] } })
        //.populate('user', 'label', 'path')
        .sort({'path': 1}) // sort by date
        // .limit(perPage)
        // .skip(perPage * page)
        .exec(function (err, lists) {
            // TODO manage errors propertly
            if (err) error(err)
            else success(lists)
        })
}
ListSchema.statics.getAllDescendantByPath = function (user, path, success, error) {
    this
        .find({user: user, path: new RegExp("^" + path) })
        //.populate('user', 'label', 'path')
        .sort({'path': 1}) // sort by date
        // .limit(perPage)
        // .skip(perPage * page)
        .exec(function (err, lists) {
            // TODO manage errors propertly
            if (err) error(err)
            else success(lists)
        })
}*/

var qfindOne = function (obj) {
    return List.findOne(obj).execWithPromise();
};

module.exports = List = mongoose.model('List', ListSchema);
