const mongoose = require('mongoose')

module.exports = mongoose.model('Secret', {
  // 64 byte, hex string, index
  hash: { type: String, index: true },

  // base64 encoded, AES256 encrypted
  secretText: String,

  // Unix timestamp
  createdAt: Number,

  // Unix timestamp
  expiresAt: Number,

  // Number
  remainingViews: Number,

  // 32 byte, hex string
  iv: String
})
