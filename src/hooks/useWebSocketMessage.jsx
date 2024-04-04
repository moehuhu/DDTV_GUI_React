import { useState, useEffect } from 'react'

const useWebSocketMessage = () => {
  const [onMessage, setMessageCallback] = useState()

  useEffect(() => {
    const workerInstance = new Worker(new URL('../utils/webSocketWorker.js', import.meta.url))
    const url = new URL(window.location.href)
    const protocol = url.protocol == 'https:' ? 'wss' : 'ws'
    const wsURL = new URL(url.origin)
    wsURL.protocol = protocol
    wsURL.pathname = '/ws'
    workerInstance.postMessage({ type: 'connect', payload: wsURL.toString() })
    workerInstance.addEventListener('message', e => onMessage?.(e?.data))
    return () => workerInstance.postMessage({ type: 'close' })
  }, [onMessage]);

  const message = fn => setMessageCallback(() => fn)

  const addEventListener = (type, callback) => {
    const listenTo = { message }[type]
    listenTo?.(callback)
  }
  return { addEventListener }
}
export default useWebSocketMessage