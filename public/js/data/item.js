var moco = require('moco'),
  util = require('./util/util'),
  collection = moco.collection,
  model = moco.model;

var ajaxSync = require('./ajax-sync')('/items');

var d = require('./date');

var Item = model()
  .attr('_id', { primary: true }) // ObjectId text representation
  .attr('title') // String
  .attr('screenshot') // String
  .attr('favicon') // String url for favicon
  .attr('url') // String
  .attr('scrollX') // integer;
  .attr('scrollY') // integer;
  .attr('windowWidth') // integer;
  .attr('windowHeight') // integer;
  .attr('storageUrl')
  .attr('updatedAt', { set: d.Date })
  .attr('createdAt', { set: d.Date })
  .attr('waitingUpdate', { default: false })
  .attr('size', { get: function() {
    return this.files.reduce(function(acc, f) { return acc + f.size }, 0);
  }})
  .attr('files', { default: [] })
  .attr('tags', { default: [] })
  .attr('deleted', { default: false })
  .use(model.nestedObjects)
  .use(ajaxSync.model);


Item.prototype.markDeleted = function() {
  this.deleted = true;
  return this.save();
}

var Items = collection(Item)
  .use(collection.byId)
  .use(collection.modelsChanges)
  .use(util.collectionClear)
  .use(ajaxSync.collection);

module.exports.Item = Item;
module.exports.Items = Items;
