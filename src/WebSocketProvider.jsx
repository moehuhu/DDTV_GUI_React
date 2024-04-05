import { createContext, useEffect, useMemo } from 'react';
import mitt from 'mitt'
export const WebSocketContext = createContext();
const WebSocketProvider = ({ children }) => {
  const emitter = useMemo(() => mitt(), [])
  useEffect(() => {
    const workerInstance = new Worker(new URL('./utils/webSocketWorker.js', import.meta.url))
    workerInstance.postMessage({ type: 'connect' })
    workerInstance.addEventListener('message', e => {
      emitter.emit('message', e?.data)
    })
    return () => workerInstance.postMessage({ type: 'close' })
  }, [emitter])
  return <WebSocketContext.Provider value={{ emitter }}>
    {children}
  </WebSocketContext.Provider>
};

export default WebSocketProvider
