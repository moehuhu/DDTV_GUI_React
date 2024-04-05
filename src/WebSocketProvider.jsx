import { createContext, useState, useEffect, useMemo } from 'react';
import mitt from 'mitt'

export const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const [message, setMessage] = useState({});
  const emitter = useMemo(() => mitt(), [])
  useEffect(() => {
    const workerInstance = new Worker(new URL('./utils/webSocketWorker.js', import.meta.url))
    workerInstance.postMessage({ type: 'connect' })
    workerInstance.addEventListener('message', e => {
      setMessage(e?.data)
      emitter.emit('message', e?.data)
    })
    return () => workerInstance.postMessage({ type: 'close' })
  }, [emitter])
  return <WebSocketContext.Provider value={{ message, emitter }}>
    {children}
  </WebSocketContext.Provider>
};

export default WebSocketProvider
