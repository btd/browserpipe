// Invitation schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    _ = require('lodash'),
    bcryptRounds = 10,
    validation = require('./validation'),
    Q = require('q');

var errorMsgs = {
    invalid: 'is not valid'
}

var InvitationSchema = new Schema({    
    email: { type: String, required: true, validate: [ /\S+@\S+\.\S/, errorMsgs.invalid], trim: true, lowercase: true},
    reason: { type: String, trim: true, validate: validation.nonEmpty}
});

module.exports = Invitation = mongoose.model('Invitation', InvitationSchema);
