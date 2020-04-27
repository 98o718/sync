const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const syncSocket = require('./ws/sync')

app.use((req, res, next) => {
  req.io = io
  next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use('/auth', require('./routes/auth'))
// app.use('/game', require('./routes/game'))

syncSocket(io)

http.listen(process.env.PORT || 3000, () => {
  console.log(`Sync app listening on port ${process.env.PORT || 3000}!`)
})
