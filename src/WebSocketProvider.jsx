import { createContext, useEffect, useMemo } from 'react';
import mitt from 'mitt'
const workerURL = new URL('./utils/webSocketWorker.js', import.meta.url)
export const WebSocketContext = createContext();
const WebSocketProvider = ({ children }) => {
  const emitter = useMemo(() => mitt(), [])
  useEffect(() => {
    const workerInstance = new Worker(workerURL, { type: 'module' })
    workerInstance.addEventListener('message', e => emitter.emit(e?.data?.code, e?.data?.data))
    return () => workerInstance.postMessage({ type: 'close' })
  }, [emitter])
  return <WebSocketContext.Provider value={{ emitter }}>
    {children}
  </WebSocketContext.Provider>
};

export default WebSocketProvider
