var Schema = require('mongoose').Schema    

var ContainerSchema = new Schema({
    type: {type: Number, required: true},  //0: window, 1: empty, 2: folders
    title: {type: String, trim: true},
    
    //For 0 container (associated with a window)
    externalId: {type: String, trim: true},

    //For 2 container (future containers)
    folder: {type: Schema.ObjectId, ref: 'Folder'},
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

ContainerSchema.plugin(require('../util/mongoose-timestamp'));

module.exports = ContainerSchema;
