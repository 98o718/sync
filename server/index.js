const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const syncSocket = require('./ws/sync')

syncSocket(io)

http.listen(process.env.PORT || 3000, () => {
  console.log(`Sync app listening on port ${process.env.PORT || 3000}!`)
})
