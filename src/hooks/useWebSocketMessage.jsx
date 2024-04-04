import { useState, useEffect } from 'react'

const useWebSocketMessage = () => {
  const [onMessage, setMessageCallback] = useState()

  useEffect(() => {
    const workerInstance = new Worker(new URL('../utils/webSocketWorker.js', import.meta.url))
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