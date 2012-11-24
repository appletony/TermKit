var router = require('./router'),
    io = require('socket.io'),
    blage = require('blage'),
    path = require('path'),
    http = require('http'),
    kip = require('kip')

var file = kip(path.dirname(__filename), {
  cache: '50mb'
})

// Load config file.
var config = require('./config').getConfig()

// Set up http server.
var server = http.createServer(blage(file)).listen(2222)

// Set up WebSocket and handlers.
io.listen(server).sockets.on('connection', function (socket) {
  var p = new router.router(socket)
})
