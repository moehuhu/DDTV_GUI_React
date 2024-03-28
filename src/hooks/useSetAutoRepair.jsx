import { getAutoRepair, setAutoRepair } from "../api/config"
import { useBoolean } from 'ahooks'
import to from "await-to-js"

const useSetAutoRepair = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean()
  const getRepairConfig = async () => {
    setTrue()
    const [err, res] = await to(getAutoRepair())
    setFalse()
    return [err, res]
  }
  const setRepairConfig = async (automatic_repair) => {
    setTrue()
    const [err, res] = await to(setAutoRepair({ automatic_repair }))
    setFalse()
    return [err, res]
  }
  return { isLoading, getRepairConfig, setRepairConfig }
}
export default useSetAutoRepair