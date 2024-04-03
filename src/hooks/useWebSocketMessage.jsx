const url = new URL(window.location.href)
const protocol = url.protocol == 'https:' ? 'wss' : 'ws'
const wsURL = new URL(url.origin)
wsURL.protocol = protocol
wsURL.pathname = '/ws'
import { useState } from 'react'
import { useWebSocket } from 'ahooks'
import { singletonHook } from 'react-singleton-hook';

const useWebSocketMessage = singletonHook(wsURL, (options) => {
  const [ws] = useState(wsURL)
  const result = useWebSocket(ws, options)
  return result
})
export default useWebSocketMessage