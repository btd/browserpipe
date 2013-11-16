var _ = require('lodash'),
    moco = require('moco'),
    util = require('./util/util'),
    collection = moco.collection,
    model = moco.model;


var Item = model()
    .attr('_id', { primary: true }) // ObjectId text representation
    .attr('label') // String
    .attr('title') // String
    .attr('screenshot') // String
    .attr('favicon') // String url for favicon
    .attr('url') // String
    .attr('note') // String
    .attr('type') // integer;
    .attr('folders') // array of folder id's
    .attr('containers') // array of container id's
    .attr('externalId'); // id of the tab if it has

var Items = collection(Item)
    .use(collection.byId)
    .use(collection.modelsChanges)
    .use(util.collectionClear);

module.exports.Item = Item;
module.exports.Items = Items;
