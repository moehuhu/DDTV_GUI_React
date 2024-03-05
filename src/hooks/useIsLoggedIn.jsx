import useLocalAccessToken from "./useLocalAccessToken";
import useDokiDoki from "./useDokiDoki"
import { useState } from "react";
import { useInterval } from "ahooks";

const useIsLoggedIn = () => {
  const { accessKeyId, accessKeySecret } = useLocalAccessToken()
  const [isCliLoggedIn, setIsCliLoggedIn] = useState(accessKeyId && accessKeySecret)
  const [systemState, setSystemState] = useState({})
  const { heartBeat } = useDokiDoki()
  const setIsLoggedIn = (state) => {
    if (!state) {
      localStorage.removeItem('AccessKeyId')
      localStorage.removeItem('AccessKeySecret')
    }
    setIsCliLoggedIn(state)
  }
  useInterval(async () => {
    const [err, res] = await heartBeat()
    if (res) { setIsLoggedIn(true); setSystemState(res?.data) }
    if (err) {
      localStorage.removeItem('AccessKeyId')
      localStorage.removeItem('AccessKeySecret')
      setIsLoggedIn(false)
    }
  }, 10000)
  return [isCliLoggedIn, setIsLoggedIn, systemState]
}
export default useIsLoggedIn