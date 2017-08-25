const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const routes = require('./routes/index')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const cryptowatch = require('./cryptowatch')
app.use(express.static(path.join(__dirname, 'views')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
  //res.locals.h = helpers
  //res.locals.flashes = req.flash()
  res.locals.user = req.user || null
  res.locals.currentPath = req.path
  next()
})

app.use('/', routes)

io.on('connection', (socket) => {
  cryptowatch.getBittrexMarkets().then(res => {
    socket.emit('markets', res)
  })
})

module.exports = server
