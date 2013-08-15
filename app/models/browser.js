// Browser schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    q = require('q');

var BrowserSchema = new Schema({    
    name: {type: String, trim: true}
    //Posible future fields: type, notes
});

BrowserSchema.plugin(require('../util/mongoose-timestamp'));

module.exports = BrowserSchema