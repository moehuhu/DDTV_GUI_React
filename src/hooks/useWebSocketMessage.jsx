import { useContext } from 'react'
import { WebSocketContext } from '../WebSocketProvider'

const useWebSocketMessage = () => {
  const { emitter } = useContext(WebSocketContext)
  const addEventListener = (type, callback) => {
    emitter.on(type, callback)
  }
  const removeEventListener = (type, callback) => {
    emitter.off(type, callback)
  }
  return { addEventListener, removeEventListener }
}

export default useWebSocketMessage