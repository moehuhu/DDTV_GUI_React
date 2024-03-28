import { getAutoRepair, setAutoRepair } from "../api/config"
import { useBoolean } from 'ahooks'
import { useState } from "react"
import to from "await-to-js"

const useAutoRepair = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean()
  const [isAutoRepair, setIsAutoRepair] = useState(false)
  const getRepairConfig = async () => {
    setTrue()
    const [err, res] = await to(getAutoRepair())
    setIsAutoRepair(res?.data?.data || false)
    setFalse()
    return [err, res]
  }
  const setRepairConfig = async () => {
    setTrue()
    const [err, res] = await to(setAutoRepair({ automatic_repair: isAutoRepair }))
    setFalse()
    return [err, res]
  }
  return { isLoading, isAutoRepair, setIsAutoRepair, getRepairConfig, setRepairConfig }
}
export default useAutoRepair