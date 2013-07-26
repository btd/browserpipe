var Schema = require('mongoose').Schema,
    validation = require('./validation'),    
    q = require('q');

var ContainerSchema = new Schema({
    type: {type: Number, required: true}, //0: blank, 1: list, 2: search, 3: import, 4: device, 5: trash
    title: {type: String, trim: true, required: true, validate: validation.nonEmpty},
    filter: {type: String, trim: true, required: true}
});

ContainerSchema.plugin(require('../util/mongoose-timestamp'));

module.exports = ContainerSchema;
