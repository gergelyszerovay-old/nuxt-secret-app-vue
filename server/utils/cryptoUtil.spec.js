import * as cryptoUtil from './cryptoUtil'

describe('getSHA256 generates an SHA256 hash in hex format', () => {
  it('SHA256 test', () => {
    expect(cryptoUtil.getSHA256('test 1')).toEqual('f67213b122a5d442d2b93bda8cc45c564a70ec5d2a4e0e95bb585cf199869c98')
  })

  it('AES256 CBC symmetric encryption and decryption test', () => {
    const text = 'secret to encrypt'
    const iv = cryptoUtil.getIV()
    const key = cryptoUtil.getSHA256('secret key')
    const encrypted = cryptoUtil.encryptFromUTF8(text, key, iv)
    expect(cryptoUtil.decryptToUTF8(encrypted, key, iv)).toEqual(text)
  })
})
