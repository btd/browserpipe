var moco = require('moco'),
  util = require('./util/util'),
  collection = moco.collection,
  model = moco.model;

var Tag = model()
  .attr('_id', { primary: true }); // that is a value of this tag

Tag.prototype.toJSON = function() {
  return this._id;
};

var Tags = collection(Tag)
  .use(collection.byId)
  .use(collection.modelsChanges)
  .use(util.collectionClear);

exports.Tag = Tag;
exports.Tags = Tags;

