import { useState } from "react"
import to from "await-to-js"
import { getDokidoki } from "../api"

const useDokiDoki = () => {
  const [err, setError] = useState(null)
  const [heartBeatStatus, setHeartBeatStatus] = useState(null)
  const heartBeat = async () => {
    const [err, res] = await to(getDokidoki())
    setError(err)
    setHeartBeatStatus(res?.data)
    return [err, res?.data]
  }

  return { err, heartBeatStatus, heartBeat }

}
export default useDokiDoki