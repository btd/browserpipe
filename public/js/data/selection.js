var _ = require('lodash'),
    moco = require('moco'),
    collection = moco.collection,
    model = moco.model

var Selection = model()
    .attr('listboards') // collection of listboards
    .attr('containers') // collection of containers
    .attr('items') // collection of items
    .attr('folders') // collection of folders
    .use(model.nestedObjects);

module.exports.Selection = Selection;





