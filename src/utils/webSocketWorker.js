let socket = null
const toData = message => JSON.parse(message.data)

const connect = (wsURL) => {
  socket = new WebSocket(wsURL);
  socket.addEventListener('message', event => self.postMessage(toData(event)))
}
self.addEventListener('message', ({ data }) => {
  const func = {
    'connect': () => connect(data?.payload),
    'close': () => socket?.readyState === 1 && socket?.close?.()
  }[data?.type]
  func?.()
})