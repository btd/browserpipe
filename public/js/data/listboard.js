var _ = require('lodash'),
    moco = require('moco'),
    collection = moco.collection,
    model = moco.model,

    Items = require('./item').Items;

var Container = model()
    .attr('_id', { primary: true }) // ObjectId text representation
    .attr('label') // String
    .attr('items', { collection: Items }) // collection of items
    .attr('folder') // Folder if type === 2
    .attr('type') // integer; usually 1*/
    .use(model.nestedObjects);

var Containers = collection(Container)
    .use(collection.byId)
    .use(collection.modelsChanges);

module.exports.Container = Container;
module.exports.Containers = Containers;

var Listboard = model()
    .attr('_id', { primary: true }) // ObjectId text representation
    .attr('label') // String
    .attr('containers', { collection: Containers }) // collection of containers
    .attr('type') // integer; usually 1
    .use(model.nestedObjects);


var Listboards = collection(Listboard)
    .use(collection.byId)
    .use(collection.modelsChanges);

module.exports.Listboard = Listboard;
module.exports.Listboards = Listboards;




