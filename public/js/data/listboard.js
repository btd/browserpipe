var _ = require('lodash'),
    moco = require('moco'),
    util = require('./util/util'),
    collection = moco.collection,
    model = moco.model,

    Items = require('./item').Items;

var Container = model()
    .attr('_id', { primary: true }) // ObjectId text representation
    .attr('title') // String
    .attr('items') // items ids
    .attr('type') // integer; usually 1*/
    .attr('externalId') // id of the window, for type == 0
    .attr('listboardId') // listboard id that contains it
    .use(model.nestedObjects);

var Containers = collection(Container)
    .use(collection.byId)
    .use(collection.modelsChanges)
    .use(util.collectionClear);

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
    .use(collection.modelsChanges)
    .use(util.collectionClear);

module.exports.Listboard = Listboard;
module.exports.Listboards = Listboards;




