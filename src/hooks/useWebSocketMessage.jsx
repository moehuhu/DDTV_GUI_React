import { useState, useEffect, useContext } from 'react'
import { WebSocketContext } from '../WebSocketProvider'

const useWebSocketMessage = () => {
  const [onMessage, setMessageCallback] = useState()
  const wsMessage = useContext(WebSocketContext)
  useEffect(() => {
    onMessage?.(wsMessage)
  }, [onMessage, wsMessage]);
  const message = fn => setMessageCallback(() => fn)
  const addEventListener = (type, callback) => {
    const listenTo = { message }[type]
    listenTo?.(callback)
  }
  const removeEventListener = (type) => {
    const listenTo = { message }[type]
    listenTo?.(null)
  }
  return { addEventListener, removeEventListener }
}
export default useWebSocketMessage