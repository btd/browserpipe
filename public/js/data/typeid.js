var _ = require('lodash'),
    moco = require('moco'),
    util = require('./util/util'),    
    model = moco.model

var TypeId = model()
    .attr('type') // type of object: listboard, folder, container, item
    .attr('_id') // id of object
    .use(model.nestedObjects);
