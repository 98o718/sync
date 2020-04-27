export const disconnect = (socket) => {
  socket.removeAllListeners()
  socket.disconnect()
}

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

export const changeUrl = (socket, url) => {
  socket.emit('set-url', url)
}

export const handleUrlChange = (socket, cb) => {
  socket.on('change-url', (data) => cb(data))
}

export const play = (socket, time) => {
  socket.emit('play', time)
}

export const changePlay = (socket, cb) => {
  socket.on('play', (data) => cb(data))
}

export const pause = (socket) => {
  socket.emit('pause')
}

export const changePause = (socket, cb) => {
  socket.on('pause', (data) => cb(data))
}

export const seek = (socket, time) => {
  socket.emit('seek', time)
}

export const changeSeek = (socket, cb) => {
  socket.on('seek', (data) => cb(data))
}
