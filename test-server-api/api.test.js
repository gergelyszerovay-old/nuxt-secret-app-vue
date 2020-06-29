import { expect } from '@jest/globals'

const mongoose = require('mongoose')
const supertest = require('supertest')
const moment = require('moment')

const mode = 'local'

const getRequest = (mode) => {
  if (mode === '3000') {
    return supertest('http://localhost:3000')
  } else if (mode === '3001') {
    return supertest('http://localhost:3001')
  } else if (mode === 'local') {
    // tear down db connection
    afterAll(async () => {
      await mongoose.connection.close()
    })

    const app = require('../server/server-middleware')
    return supertest(app)
  }
}

const request = getRequest(mode)

const ts = moment().unix()

const expectedResponse = {
  hash: '900a4469df00ccbfd0c145c6d1e4b7953dd0afafadd7534e3a4019e8d38fc663',
  secretText: 'text 1',
  // createdAt: 1593183455,
  expiresAt: 0,
  remainingViews: 1
}

const newSecret = {
  secret: expectedResponse.secretText,
  expireAfterViews: expectedResponse.remainingViews,
  expireAfter: 0
}

describe('API test', () => {
  describe('POST /api/secret/ stores the secret', () => {
    let result
    beforeAll((done) => {
      request
        .post('/api/secret/')
        .set('Content-Type', 'application/json')
        .send(newSecret)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          result = res.body
          // console.log(res)
          if (err) {
            return done(err)
          }
          done()
        })
    })

    it('returns the hash', () => {
      expect(result.hash).toEqual(expectedResponse.hash)
    })

    it('returns the expiration date', () => {
      expect(result.expiresAt).toEqual(expectedResponse.expiresAt)
    })

    it('returns the remaining views', () => {
      expect(result.remainingViews).toEqual(expectedResponse.remainingViews)
    })

    it('returns the secret text', () => {
      expect(result.secretText).toEqual(expectedResponse.secretText)
    })

    it('returns the creation timestamp', () => {
      expect(result.createdAt).toBeGreaterThanOrEqual(ts)
      expect(result.createdAt).toBeLessThanOrEqual(moment().unix())
    })
  })

  describe('GET /api/secret/[hash] gets the secret', () => {
    let result
    beforeAll((done) => {
      request
        .post('/api/secret/')
        .set('Content-Type', 'application/json')
        .send(newSecret)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          request
            .get('/api/secret/' + expectedResponse.hash)
            .set('Accept', 'application/json')
            .send()
            .expect(200)
            .end((err2, res2) => {
              result = res2.body
              if (err2) {
                return done(err2)
              }
              done()
            })
        })
    })

    it('returns the hash', () => {
      expect(result.hash).toEqual(expectedResponse.hash)
    })

    it('returns the expiration date', () => {
      expect(result.expiresAt).toEqual(expectedResponse.expiresAt)
    })

    it('returns the remaining views and it\'s decreased by 1', () => {
      expect(result.remainingViews).toEqual(expectedResponse.remainingViews - 1)
    })

    it('returns the secret text', () => {
      expect(result.secretText).toEqual(expectedResponse.secretText)
    })

    it('returns the creation timestamp', () => {
      expect(result.createdAt).toBeGreaterThanOrEqual(ts)
      expect(result.createdAt).toBeLessThanOrEqual(moment().unix())
    })
  })

  describe('GET /api/secret/[hash] returns error + 401 status, when the remainingViews = 0 in the DB', () => {
    let result
    beforeAll((done) => {
      request
        .post('/api/secret/')
        .set('Content-Type', 'application/json')
        .send(newSecret)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          request
            .get('/api/secret/' + expectedResponse.hash)
            .set('Accept', 'application/json')
            .send()
            .expect(200)
            .end((err2, res2) => {
              if (err2) {
                return done(err2)
              }
              request
                .get('/api/secret/' + expectedResponse.hash)
                .set('Accept', 'application/json')
                .send()
                .expect(401)
                .end((err3, res3) => {
                  result = res3.body
                  if (err3) {
                    return done(err3)
                  }
                  done()
                })
            })
        })
    })

    it('returns an error message', () => {
      expect(result.message).toEqual('Secret expired (View count)')
    })
  })

  describe('GET /api/secret/[hash] returns error + 401 status, when the secret expired', () => {
    let result
    beforeAll((done) => {
      request
        .post('/api/secret/')
        .set('Content-Type', 'application/json')
        .send(Object.assign({}, newSecret, { expireAfter: 0.00000001 }))
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          request
            .get('/api/secret/' + expectedResponse.hash)
            .set('Accept', 'application/json')
            .send()
            .expect(401)
            .end(function (err2, res2) {
              result = res2.body
              if (err2) {
                return done(err2)
              }
              done()
            })
        })
    })

    it('returns an error message', () => {
      expect(result.message).toEqual('Secret expired (TTL)')
    })
  })

  describe('POST /api/secret/ parameter validation', () => {
    it('it doesn\'t accepts additional parameters', (done) => {
      request
        .post('/api/secret/')
        .set('Content-Type', 'application/json')
        .send(Object.assign({}, newSecret, { ADDITIONAL_PARAMETER: 0 }))
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          done()
        })
    })
  })
})
