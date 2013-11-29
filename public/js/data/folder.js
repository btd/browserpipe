var _ = require('lodash'),
    moco = require('moco'),
    util = require('./util/util'),
    collection = moco.collection,
    model = moco.model;

var Folders = collection()// i will define model later
    .use(collection.byId)
    .use(collection.byField('filter'))
    .use(collection.modelsChanges)
    .use(util.collectionClear)

var Folder = model()
    .attr('_id', { primary: true }) // ObjectId text representation
    .attr('label') // String
    .attr('children') // array of folder Ids
    .attr('items') // items ids
    .attr('path') // String
    .attr('isRoot', {
        get: function() {
            return _.isEmpty(this.path);
        }
    })
    .attr('filter', {
        get: function() {
            //console.log((this.isRoot ? "" : this.path + "/") + this.label)
            return (this.isRoot ? "" : this.path + "/") + this.label;
        }
    })
    .use(model.nestedObjects);

Folders.model = Folder;

module.exports.Folder = Folder;
module.exports.Folders = Folders;
