const url = new URL(location.href)
const protocol = url.protocol == 'https:' ? 'wss' : 'ws'
const wsURL = new URL(url.origin)
wsURL.protocol = protocol
wsURL.pathname = '/ws'
const toData = message => JSON.parse(message.data)
const socket = new WebSocket(wsURL);
const events = []
socket.addEventListener('message', event => events.push(event))
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const postMessage = async () => {
  while (events.length > 0) {
    const event = events.shift()
    const data = toData(event)
    self.postMessage(data)
    await delay(100)
  }
}
const post = () => setInterval(postMessage, 100)
self.addEventListener('message', ({ data }) => {
  const func = {
    'connect': () => post(),
    'close': () => socket?.readyState === 1 && socket?.close?.()
  }[data?.type]
  func?.()
})