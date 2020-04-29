import React from 'react'
import { SyncContext } from './context'

export const SyncProvider = (props) => {
  return (
    <SyncContext.Provider value={props.value}>
      {props.children}
    </SyncContext.Provider>
  )
}
