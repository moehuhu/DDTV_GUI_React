import { getHLSWaitingTime, setHLSWaitingTime } from "../api/config"
import { useBoolean } from 'ahooks'
import to from "await-to-js"
const useSetHLS = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean()
  const getHLSTime = async () => {
    setTrue()
    const [err, res] = await to(getHLSWaitingTime())
    setFalse()
    return [err, res]
  }
  const setHLSTime = async (time) => {
    setTrue()
    const [err, res] = await to(setHLSWaitingTime({ time }))
    setFalse()
    return [err, res]
  }
  return { isLoading, getHLSTime, setHLSTime }
}
export default useSetHLS