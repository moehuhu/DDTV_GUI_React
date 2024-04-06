import { useContext } from 'react'
import { WebSocketContext } from '../WebSocketProvider'

const useWebSocketMessage = () => {
  const { emitter } = useContext(WebSocketContext)
  const addEventListener = (code, callback) => {
    emitter.on(code, callback)
  }
  const removeEventListener = (code, callback) => {
    emitter.off(code, callback)
  }
  return { addEventListener, removeEventListener }
}

export default useWebSocketMessage