import { getCoreVersion } from "../api/system"
import { useBoolean } from 'ahooks'
import { useState } from "react"
import to from "await-to-js"
const useCoreVersion = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean()
  const [version, setVersion] = useState(null)
  const getVersion = async () => {
    setTrue()
    const [err, res] = await to(getCoreVersion())
    setVersion(res?.data)
    setFalse()
    return [err, res]
  }
  return { isLoading, version, getVersion }
}
export default useCoreVersion