import { useState } from "react"
import to from "await-to-js"
import { getDokidoki } from "../api"
import useLocalAccessToken from "./useLocalAccessToken"

const useDokiDoki = () => {
  const [err, setError] = useState(null)
  const [heartBeatStatus, setHeartBeatStatus] = useState(null)
  const { accessKeyid, accessKeySecret } = useLocalAccessToken()
  const heartBeat = async () => {
    if (!(accessKeyid && accessKeySecret)) { return }
    const [err, res] = await to(getDokidoki())
    setError(err)
    setHeartBeatStatus(res?.data)
    if (err) {
      localStorage.clear()
    }
  }

  return { err, heartBeatStatus, heartBeat }

}
export default useDokiDoki