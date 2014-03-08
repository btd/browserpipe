var moco = require('moco'),
    util = require('./util/util'),
    collection = moco.collection,
    model = moco.model;


var Item = model()
    .attr('_id', { primary: true }) // ObjectId text representation
    .attr('items', { default: [] }) // for type=2 container
    .attr('parent') //parent reference
    .attr('previous') //previous reference
    .attr('next') //next reference
    .attr('visible') //Boolean
    .attr('title') // String
    .attr('screenshot') // String
    .attr('favicon') // String url for favicon
    .attr('url') // String
    .attr('type') // integer;
    .attr('externalId') // id of the tab if it has
    .use(function(Model) { 
      Model.prototype.isFolder = function() {
	return this.type === 2;
      }
    });


var Items = collection(Item)
    .use(collection.byId)
    .use(collection.modelsChanges)
    .use(util.collectionClear);

module.exports.Item = Item;
module.exports.Items = Items;
