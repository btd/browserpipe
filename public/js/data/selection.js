var moco = require('moco'),
    model = moco.model,
    Listboards = require('./listboard').Listboards,
    Containers = require('./listboard').Containers,
    Items = require('./item').Items,
    Folders = require('./folder').Folders;

var Selection = model()
    .attr('listboards', { collection: Listboards }) // collection of listboards
    .attr('containers', { collection: Containers }) // collection of containers 
    .attr('items', { collection: Items }) // collection of items
    .attr('folders', { collection: Folders }) // collection of folders
    .use(model.nestedObjects);

module.exports.Selection = Selection;


