import React from 'react'
import { SocketContext } from './SocketContext'

export const SocketProvider = (props) => {
  return (
    <SocketContext.Provider value={props.socket}>
      {props.children}
    </SocketContext.Provider>
  )
}
