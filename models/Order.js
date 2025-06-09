const mongoose = require('mongoose');

const OrderSchema = {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true,
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    order: {
        type: String,
        required: true
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    placed: {
        type: Boolean,
        default: false,
    },
}


module.exports = mongoose.model('Order', OrderSchema)