import { createContext, useState, useEffect } from 'react';

export const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const [message, setMessage] = useState({});
  useEffect(() => {
    const workerInstance = new Worker(new URL('./utils/webSocketWorker.js', import.meta.url))
    workerInstance.postMessage({ type: 'connect' })
    workerInstance.addEventListener('message', e => setMessage(e?.data))
    return () => workerInstance.postMessage({ type: 'close' })
  });

  return (
    <WebSocketContext.Provider value={message}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider
