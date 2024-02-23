import useLocalAccessToken from "./useLocalAccessToken";
import useDokiDoki from "./useDokiDoki"
import { useState } from "react";
import { useInterval } from "ahooks";

const useIsLoggedIn = () => {
  const { accessKeyid, accessKeySecret } = useLocalAccessToken()
  const [isLoggedIn, setIsLoggedIn] = useState(accessKeyid && accessKeySecret)
  const { heartBeat } = useDokiDoki()
  useInterval(async () => {
    const [err, res] = await heartBeat()
    if (res) { setIsLoggedIn(true) }
    if (err) {
      localStorage.removeItem('AccessKeyId')
      localStorage.removeItem('AccessKeySecret')
      setIsLoggedIn(false)
    }
  }, 15000)
  return [isLoggedIn, setIsLoggedIn]
}
export default useIsLoggedIn