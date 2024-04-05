import { useContext } from 'react'
import { useSetState } from 'ahooks'
import { WebSocketContext } from '../WebSocketProvider'
import _ from 'lodash'

const useWebSocketMessage = () => {
  const [callbacks, setMessageCallback] = useSetState({})
  const { emitter } = useContext(WebSocketContext)
  const addEventListener = (type, callback) => {
    setMessageCallback({ [type]: callback })
    emitter.on(type, callback)
  }
  const removeEventListener = (type) => {
    setMessageCallback(_.omit(callbacks, type))
    emitter.off(type, callbacks[type])
  }
  return { addEventListener, removeEventListener }
}
export default useWebSocketMessage