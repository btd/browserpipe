var moco = require('moco'),
    model = moco.model,
    Items = require('./item').Items;

var Selection = model()
    .attr('items', { collection: Items }) // collection of items
    .use(model.nestedObjects);

module.exports.Selection = Selection;


