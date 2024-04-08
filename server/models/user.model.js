const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: Schema.Types.String },
    email: { type: Schema.Types.String },
    phone: { type: Schema.Types.String },
    password: { type: Schema.Types.String },
    loginSessionId: { type: Schema.Types.String },
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } });

module.exports = mongoose.model('user', userSchema);