var _ = require('lodash'),
    moco = require('moco'),
    collection = moco.collection,
    model = moco.model,
    Items = require('./item').Items;

var Folders = collection()// i will define model later
    .use(collection.byId)
    .use(collection.byField('filter'))
    .use(collection.modelsChanges)

var Folder = model()
    .attr('_id', { primary: true }) // ObjectId text representation
    .attr('label') // String
    .attr('children', { collection: Folders }) // collection of sub folders
    .attr('items', { collection: Items }) // collection of items
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
