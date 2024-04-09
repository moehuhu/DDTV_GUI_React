import to from "await-to-js"
import { useState } from "react"
import { useBoolean } from 'ahooks'
import { getSystemResource } from "../api/system"
const useSystemSource = () => {
  const [systemState, setRes] = useState()
  const [isLoading, { setTrue, setFalse }] = useBoolean(false)

  const getSystemState = async () => {
    setTrue()
    const [err, res] = await to(getSystemResource())
    setRes(res?.data?.data)
    setFalse()
    return [err, res?.data?.data]
  }

  return { systemState, isLoading, getSystemState }
}
export default useSystemSource