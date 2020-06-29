const mongoose = require('mongoose')

module.exports = mongoose.model('Secret', {
  hash: { type: String, index: true },
  secretText: String,
  createdAt: Number,
  expiresAt: Number,
  remainingViews: Number,
  iv: String
})
