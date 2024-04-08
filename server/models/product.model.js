const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: { type: Schema.Types.String },
    category: { type: Schema.Types.String },
    description: { type: Schema.Types.String },
    amount: { type: Schema.Types.Number },
    tags: [{ type: Schema.Types.String }],
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } });

module.exports = mongoose.model('product', productSchema);