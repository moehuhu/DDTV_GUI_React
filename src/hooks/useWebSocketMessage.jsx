import { useContext } from 'react'
import { WebSocketContext } from '../WebSocketProvider'

const useWebSocketMessage = () => {
  const { emitter } = useContext(WebSocketContext)
  return { addEventListener: emitter.on, removeEventListener: emitter.off }
}

export default useWebSocketMessage