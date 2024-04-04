const url = new URL(location.href)
const protocol = url.protocol == 'https:' ? 'wss' : 'ws'
const wsURL = new URL(url.origin)
wsURL.protocol = protocol
wsURL.pathname = '/ws'
const toData = message => JSON.parse(message.data)
const socket = new WebSocket(wsURL);
socket.addEventListener('message', event => self.postMessage(toData(event)))
self.addEventListener('message', ({ data }) => {
  const func = {
    'close': () => socket?.readyState === 1 && socket?.close?.()
  }[data?.type]
  func?.()
})