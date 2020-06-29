const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const { OpenApiValidator } = require('express-openapi-validator')
const yaml = require('js-yaml')
const mongoose = require('mongoose')

const init = new Promise((resolve, reject) => {
  mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).catch((error) => {
    console.log(error)
    process.exit()
    // reject(error)
  }).then(() => {
    const app = express()

    console.log('MongoDB connected.')

    const swaggerUi = require('swagger-ui-express')

    const apiSpecFile = path.join(__dirname, 'api.yaml')

    const apiSpecContents = fs.readFileSync(apiSpecFile, 'utf8')
    const apiSpec = yaml.safeLoad(apiSpecContents)

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.text())
    app.use(bodyParser.json())

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec))

    app.use(logger('dev'))

    app.use('/api-spec', express.static(apiSpecFile))

    new OpenApiValidator({
      apiSpec: apiSpecFile,
      validateRequests: true,
      // validateResponses: true,
      operationHandlers: path.join(__dirname)
    })
      .install(app)
      .then(() => {
        app.use((err, req, res, next) => {
          // format errors
          res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors
          })
        })
        console.log('API spec loaded.')
        resolve(app)
      })
  })
})

module.exports = async (req, res, next) => {
  const app = await init
  app(req, res, next)
}
