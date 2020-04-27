const { uuid, isUuid } = require('uuidv4')

module.exports = (io) => {
  const users = {}

  const rooms = {}

  io.on('connection', (socket) => {
    console.log('connected')
    users[socket.id] = {
      room: null,
    }

    socket.on('disconnect', () => {
      console.log(socket.id, 'disconnect')
      const { room } = users[socket.id]
      if (room && rooms[room] && rooms[room].users.length === 1) {
        delete rooms[room]
      } else if (room && room && rooms[room]) {
        rooms[room].users = rooms[room].users.filter(
          (user) => user !== socket.id
        )
      }
      delete users[socket.id]
    })

    const createRoom = (room) => {
      rooms[room] = {
        users: [socket.id],
        url: null,
        admin: socket.id,
      }

      users[socket.id].room = room

      socket.join(room)

      socket.emit('created', { room })

      console.log(users, rooms)
      console.log('room')
    }

    const onRoomJoined = (room) => {
      const { admin, url } = rooms[room]

      socket.emit('joined', { admin: admin === socket.id, url })
    }

    socket.on('room', (payload) => {
      const { room } = payload

      if (room !== undefined && isUuid(room)) {
        if (rooms[room] !== undefined) {
          if (!rooms[room].users.includes(socket.id)) {
            socket.join(room)
            users[socket.id].room = room
            rooms[room].users = [...rooms[room].users, socket.id]
          }

          console.log(socket.id)
          console.log('joined room', room)
          console.log(
            'there are',
            io.sockets.adapter.rooms[room].length,
            'people'
          )
          onRoomJoined(room)
        } else {
          createRoom(room)
          onRoomJoined(room)
        }
      } else {
        const newRoom = uuid()

        createRoom(newRoom)
        onRoomJoined(newRoom)
      }
    })

    socket.on('leave', () => {
      const { room } = users[socket.id]

      if (room && rooms[room] && rooms[room].users.length === 1) {
        delete rooms[room]
      } else if (room) {
        rooms[room].users = rooms[room].users.filter(
          (user) => user !== socket.id
        )
      }
    })

    socket.on('set-url', (url) => {
      const { room } = users[socket.id]

      if (room && rooms[room]) {
        rooms[room].url = url

        io.to(room).emit('change-url', url)
      }
    })

    socket.on('play', (time) => {
      const { room } = users[socket.id]

      if (room && rooms[room]) {
        io.to(room).emit('play', time)
      }
    })

    socket.on('pause', () => {
      const { room } = users[socket.id]

      if (room && rooms[room]) {
        io.to(room).emit('pause')
      }
    })

    socket.on('seek', (time) => {
      const { room } = users[socket.id]

      if (room && rooms[room]) {
        io.to(room).emit('seek', time)
      }
    })
  })
}
