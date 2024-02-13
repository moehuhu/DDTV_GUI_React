const useOpenBilibiliPage = (item) => {
  const { roomInfo, userInfo } = item
  const openBiliLiveRoom = () => {
    window.open(roomInfo?.url)
  }
  const openBiliHomepage = () => {
    window.open('https://space.bilibili.com/' + userInfo?.uid)
  }
  return [openBiliLiveRoom, openBiliHomepage]
}
export default useOpenBilibiliPage