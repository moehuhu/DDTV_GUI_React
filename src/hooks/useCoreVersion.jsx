import { getCoreVersion } from "../api/config"
import { useBoolean } from 'ahooks'
import to from "await-to-js"
const useCoreVersion = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean()
  const getVersion = async () => {
    setTrue()
    const [err, res] = await to(getCoreVersion())
    setFalse()
    return [err, res]
  }
  return { isLoading, getVersion }
}
export default useCoreVersion