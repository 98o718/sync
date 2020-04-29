import React, { useEffect } from 'react'
import { createRoom, onRoomCreated, useSync } from '../context'
import { BarLoader } from 'react-spinners'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

export const CreatePage = () => {
  const { socket } = useSync()

  const history = useHistory()

  useEffect(() => {
    createRoom(socket)

    onRoomCreated(socket, ({ room }) => {
      toast.success('Комната создана!')
      history.push(`/room/${room}`)
    })
  }, [history, socket])

  return <BarLoader width="100%" />
}
