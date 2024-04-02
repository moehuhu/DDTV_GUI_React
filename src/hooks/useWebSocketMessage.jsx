const url = new URL(window.location.href)
const protocol = url.protocol == 'https:' ? 'wss' : 'ws'
const wsURL = new URL(url.origin)
wsURL.protocol = protocol
wsURL.pathname = '/ws'
import { useState } from 'react'
import { useWebSocket } from 'ahooks'
import { singletonHook } from 'react-singleton-hook';

const useWebSocketMessage = singletonHook(wsURL, (props) => {
  const [ws] = useState(wsURL)
  const onMessage = props?.onMesage || ((message) => { console.log(message) })
  const { latestMessage } = useWebSocket(ws, { onMessage })
  return { latestMessage }
})
export default useWebSocketMessage