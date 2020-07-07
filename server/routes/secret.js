
const moment = require('moment')
const SecretModel = require('../models/SecretModel')
const cryptoUtil = require('../utils/cryptoUtil')

const ExceptionHandler = (res, error) => {
  res.status(401).json({ message: `Exception: ${error.name} ${error.code}`, errors: [{ path: '', message: error.message, errorCode: `${error.code}` }] })
}

module.exports = {
  getSecret: async (req, res) => {
    const hashPrivate = req.params.hash
    const hashDatabase = cryptoUtil.getSHA256(hashPrivate)

    try {
      const secretToShow = await SecretModel.findOne({ hash: hashDatabase })

      if (!secretToShow) {
        res.status(401).json({ message: 'Secret not found', errors: [{ path: '', message: 'Secret not found', errorCode: 'app.error' }] })
        return
      }

      if (secretToShow.remainingViews === 0) {
        res.status(401).json({ message: 'Secret expired (View count)', errors: [{ path: '', message: 'Secret expired (View count)', errorCode: 'app.error' }] })
        return
      }

      if (secretToShow.expiresAt !== 0) {
        if (moment.unix(secretToShow.expiresAt).isSameOrBefore(moment())) {
          res.status(401).json({ message: 'Secret expired (TTL)', errors: [{ path: '', message: 'Secret expired (TTL)', errorCode: 'app.error' }] })
          return
        }
      }

      secretToShow.remainingViews--

      await secretToShow.save()

      const decryptedSecret = cryptoUtil.decryptToUTF8(secretToShow.secretText, hashPrivate, secretToShow.iv)

      const { _id, __v, hash, secretText, iv, ...result } = secretToShow.toObject()
      res.status(200).json({ hash: hashPrivate, secretText: decryptedSecret, ...result })
    } catch (error) {
      ExceptionHandler(res, error)
    }
  },
  postSecret: async (req, res) => {
    const hashPrivate = cryptoUtil.getSHA256(req.body.secret)
    const hashDatabase = cryptoUtil.getSHA256(hashPrivate)

    const newIV = cryptoUtil.getIV()

    const encryptedSecret = cryptoUtil.encryptFromUTF8(req.body.secret, hashPrivate, newIV)

    try {
      await SecretModel.deleteMany({ hash: hashDatabase })

      const newSecret = new SecretModel({
        hash: hashDatabase,
        secretText: encryptedSecret,
        createdAt: moment().unix(),
        expiresAt: (req.body.expireAfter === 0 ? 0 : moment().add(req.body.expireAfter, 'minutes').unix()),
        remainingViews: req.body.expireAfterViews,
        iv: newIV
      })

      const newSecretSaved = await newSecret.save()

      const { _id, __v, hash, iv, secretText, ...result } = newSecretSaved.toObject()
      res.status(200).json({ hash: hashPrivate, secretText: req.body.secret, ...result })
    } catch (error) {
      ExceptionHandler(res, error)
    }
  }
}
