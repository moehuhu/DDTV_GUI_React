import { useState } from "react"
import to from "await-to-js"
import { getDokidoki } from "../api"

const useDokiDoki = () => {
  const [heartBeatStatus, setHeartBeatStatus] = useState(null)
  const heartBeat = async () => {
    const [err, res] = await to(getDokidoki())
    setHeartBeatStatus(res?.data)
    return [err, res?.data]
  }

  return { heartBeatStatus, heartBeat }
}
export default useDokiDoki