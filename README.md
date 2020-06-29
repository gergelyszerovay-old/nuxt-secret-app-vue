## Quickstart

You can use *npm* or *docker-compose*.

### Installation

`git clone https://github.com/gergelyszerovay/nuxt-secret-app.git`

`cd nuxt-secret-app`

`docker-compose up install` or `npm install`

If you use npm, set the **MONGODB_CONNECTION_STRING** environment variable, eg.: 

MONGODB_CONNECTION_STRING=mongodb://localhost:27017/secret-store

### Run the app

`docker-compose up nuxt` or `npm run dev`

You can open the app here: http://localhost:3000/

You can view the app's OpenAPI 3 documentation (Swagger) here: http://localhost:3000/api-docs/

### Storybook

You can run Storybook with:

`docker-compose up storybook` or `npm run storybook`

You can open the Storybook here: http://localhost:5000/

## Overview

I wrote the app in Javascript, it's Nuxt-based and uses Nuxt's serverMiddleware to connect its API.

### Backend

It's in the [/server](https://github.com/gergelyszerovay/nuxt-secret-app/tree/master/server) folder.

**API specification**

I use the OpenAPI 3 standard to [specify the API](https://github.com/gergelyszerovay/nuxt-secret-app/blob/master/server/api.yaml). The app validates the specification and the request/response data with the *express-openapi-validator* package.

**Cryptography**

The app stores the secret texts encrypted in its database. 

When the app stores a new secret, it calculates the SHA256 hash of it. It uses this hash (as password), and an initialization vector (IV) to encrypt the secret text with the AES256 CBC algorithm. 

The app doesn't store this hash in the database, instead it calculates a second SHA256 hash from it, and stores that second one.

So if the database gets compromised, the attacker won’t be able to decode the secret texts.

When the user tries to read a secret, she/he first provides the hash of it, and then the app calculates the second hash from it, then looks up this second hash in the database. 

**Database**

The app uses MongoDB and the *mongoose* package to store its data. The schema of the database:

```
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
```

## Front-end

The app uses the *Ant Design of Vue* design system. 

I used the container/presentational component pattern to separate the logic, this pattern - among other benefits - makes the component testing easier.

I use the *Storybook.js* component explorer to show the different states of the presentational components.

## Tests

I made a few samples for each different test types. In a real life project, I'd prefer to conduct:
- backend unit tests on the logic-heavy parts of the back-end
- API tests in order to integration test the backend
- frontend unit tests on the presentational components
- end-to-end tests to integration and acceptance test the front-end and back-end together 

#### Back-end unit test example (Jest)

`docker-compose up test-server-unit` or `npm run test-server-unit`

#### Back-end API testing example (Jest + Supertest)

`docker-compose up test-server-api` or `npm run test-server-api`

#### Front-end unit (presentational component) test example (Jest + vue-test-utils)

`docker-compose up test-client-unit` or `npm run test-client-unit`

#### End-to-end test example (Jest + Jest Cucumber + Selenium Grid)

To run on Docker:

`docker-compose up test-e2e`

It starts a simple Selenium Grid with a single Chrome node and runs the tests. You can connect to the Chrome node's VNC server on the port 5900.

To run it with npm, install Firefox, then:

`npm install geckodriver -g`

`npm link geckodriver`

Set the SELENIUM_HUB_URL environment variable to 'local' (SELENIUM_HUB_URL=local), then:

`npm run test-e2e`
