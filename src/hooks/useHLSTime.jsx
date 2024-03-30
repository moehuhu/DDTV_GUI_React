import { getHLSWaitingTime, setHLSWaitingTime } from "../api/config"
import { useBoolean } from 'ahooks'
import { useState } from "react"
import to from "await-to-js"
const useHLSTime = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean()
  const [time, setTime] = useState(0)
  const getHLSTime = async () => {
    setTrue()
    const [err, res] = await to(getHLSWaitingTime())
    setTime(res?.data?.data || 0)
    setFalse()
    return [err, res]
  }
  const setHLSTime = async () => {
    setTrue()
    const [err, res] = await to(setHLSWaitingTime({ waiting_time: time }))
    setFalse()
    return [err, res]
  }
  return { isLoading, time, setTime, getHLSTime, setHLSTime }
}
export default useHLSTime