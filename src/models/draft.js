// src/models/Draft.js
const mongoose = require('mongoose');

const DraftSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true 
  },
  resourceId: {
    type: String,
    required: true
   
  },
  payload: {
    type: mongoose.Schema.Types.Mixed, 
    required: true
  },
  clientTimestamp: {
    type: Number, 
    required: true
  },
  serverUpdatedAt: {
    type: Date,
    default: Date.now
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: '24h' }
  }
});


DraftSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

module.exports = mongoose.model('Draft', DraftSchema);