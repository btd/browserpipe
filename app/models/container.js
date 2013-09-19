var Schema = require('mongoose').Schema    

var ContainerSchema = new Schema({
    type: {type: Number, required: true}, //0: now, 1: later, 2: future
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

ContainerSchema.virtual('cid').get(function() {
  return this._cid;
});

ContainerSchema.virtual('cid').set(function(cid) {
  this._cid = cid;
});

module.exports = ContainerSchema;
