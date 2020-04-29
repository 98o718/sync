import { useContext } from 'react'
import { SyncContext } from './context'

export const useSync = () => {
  const sync = useContext(SyncContext)

  return sync
}
