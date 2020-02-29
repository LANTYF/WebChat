const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

require('./routes/web')(app)

const server = require('http').createServer(app)
require('./socket')(server)

server.listen(3000, () => {
  console.log('http://127.0.0.1:3000')
})