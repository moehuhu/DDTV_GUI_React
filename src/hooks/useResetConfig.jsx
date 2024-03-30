import { resetConfig } from "../api/config"
import { useBoolean } from 'ahooks'
import to from "await-to-js"

const useResetConfig = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean()
  const reset = async () => {
    setTrue()
    const [err, res] = await to(resetConfig())
    setFalse()
    return [err, res]
  }
  return { isLoading, reset }
}
export default useResetConfig