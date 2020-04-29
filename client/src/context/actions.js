export const createRoom = (socket) => {
  if (!socket.connected) socket.open()
  socket.emit('room', { room: undefined })
}

export const leaveRoom = (socket) => {
  socket.emit('leave')
}

export const joinRoom = (socket, room) => {
  socket.emit('room', { room })
}

export const onRoomCreated = (socket, cb) => {
  socket.off('created')
  socket.on('created', (data) => cb(data))
}

export const onRoomJoined = (socket, cb) => {
  socket.off('joined')
  socket.on('joined', (data) => cb(data))
}
