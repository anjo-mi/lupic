const mongoose = require('mongoose')

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [ { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  } ],
  restaurants: [ { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  } ],
  adminId: {
    type: String,
    required: true
  },
  selection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  },
  selector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  orders: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  } ],
  lastUpdated: {
    type: Date,
    default: null,
  },
  selectorIndex: {
    type: Number,
    default: 0,
  },
  missedOrders: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  } ]
})

module.exports = mongoose.model('Group', GroupSchema)