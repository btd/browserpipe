var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash');

var ContainerSchema = new Schema({
    type: {type: Number, required: true},  //0: window, 1: empty
    title: {type: String, trim: true},
    items: [
        {type: Schema.ObjectId, ref: 'Item'}
    ],
    
    //For 0 container (associated with a window)
    externalId: {type: String, trim: true}    
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

ContainerSchema.plugin(require('../util/mongoose-timestamp'));

ContainerSchema.methods.containItemId = function (itemId) {    
    return _.some(this.items, function(item){
        return item.equals(itemId)
    });
};

ContainerSchema.methods.addItemId = function (itemId) {
    this.items.push(itemId);
    return this;
};

ContainerSchema.methods.removeItemId = function (itemId) {
    this.items.remove(itemId);
    return this;
};

module.exports = ContainerSchema;
