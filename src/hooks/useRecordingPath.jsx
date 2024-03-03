import { getRecordingPath, setRecordingPath } from "../api/config"
import { useState } from "react"
import to from "await-to-js"
import { useBoolean } from 'ahooks'

const useRecordingPath = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean(false)
  const [check, setCheckKey] = useState()
  const [path, setPath] = useState()

  const getPath = async () => {
    setTrue()
    const [err, res] = await to(getRecordingPath())
    setFalse()
    return [err, res]
  }

  const checkPath = async (path) => {
    setTrue()
    const [err, res] = await to(setRecordingPath({ path }))
    if (res?.data?.data?.check) {
      setCheckKey(res?.data?.data?.check)
      setPath(path)
    }
    setFalse()
    return [err, res?.data]
  }

  const applyPath = async () => {
    setTrue()
    const [err, res] = await to(setRecordingPath({ path, check }))
    setFalse()
    return [err, res?.data]
  }

  return { getPath, checkPath, applyPath, isLoading }

}
export default useRecordingPath