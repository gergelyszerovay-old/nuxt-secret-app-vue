const http = require('http')

const serverMiddleware = require('./server-middleware')

http.createServer(serverMiddleware).listen(3001)
console.log('Listening on port 3001')
