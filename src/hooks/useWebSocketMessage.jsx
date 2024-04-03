import { useState, useEffect } from 'react'

const useWebSocketMessage = () => {
  const [onOpen, setOpenCallback] = useState()
  const [onMessage, setMessageCallback] = useState()
  const [onClose, setCloseCallback] = useState()
  const toData = message => JSON.parse(message.data)

  useEffect(() => {
    const url = new URL(window.location.href)
    const protocol = url.protocol == 'https:' ? 'wss' : 'ws'
    const wsURL = new URL(url.origin)
    wsURL.protocol = protocol
    wsURL.pathname = '/ws'
    const newSocket = new WebSocket(wsURL);
    newSocket.onopen = e => onOpen?.(toData(e))
    newSocket.onmessage = e => onMessage?.(toData(e))
    newSocket.onclose = e => onClose?.(toData(e))
    return () => newSocket.close()
  }, [onOpen, onMessage, onClose]);

  const open = fn => setOpenCallback(() => fn)
  const message = fn => setMessageCallback(() => fn)
  const close = fn => setCloseCallback(() => fn)

  const addEventListener = (type, callback) => {
    const listenTo = { open, message, close }[type]
    listenTo?.(callback)
  }
  return { addEventListener }
}
export default useWebSocketMessage