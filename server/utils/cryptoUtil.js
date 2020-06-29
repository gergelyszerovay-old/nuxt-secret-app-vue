const crypto = require('crypto')

// result is in hex format
const getSHA256 = (s) => {
  return crypto.createHash('sha256').update(s).digest('hex')
}

// returns a new iv (hex) for AES256 CBC encrypting
const getIV = () => {
  return crypto.randomBytes(16).toString('hex')
}

// AES256 CBC encrypting
// key and iv is in hex format
// s is an UTF8 string
// result is base64 encoded
const encryptFromUTF8 = (s, key, iv) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))
  return cipher.update(s, 'utf8', 'base64') + cipher.final('base64')
}

// AES256 CBC decrypting
// key and iv is in hex format
// s is base64 encoded
// result is UTF8 encoded
const decryptToUTF8 = (s, key, iv) => {
  const cipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))
  return cipher.update(s, 'base64', 'utf8') + cipher.final('utf8')
}

module.exports = { getSHA256, getIV, encryptFromUTF8, decryptToUTF8 }
