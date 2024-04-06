const toData = message => JSON.parse(message.data)
let socket = null
const connect = (origin) => {
  const url = new URL(origin)
  const protocol = url.protocol == 'https:' ? 'wss' : 'ws'
  const wsURL = new URL(origin)
  wsURL.protocol = protocol
  wsURL.pathname = '/ws'
  socket = new WebSocket(wsURL);
  socket.addEventListener('message', event => postMessage(toData(event)))
}
const close = () => {
  socket?.readyState === 1 && socket?.close?.()
  self.close()
}
self.addEventListener('message', (e) => {
  const { data } = e
  const func = { close, connect }[data?.type]
  func?.(data?.payload)
})