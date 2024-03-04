import { getRecordingPath, setRecordingPath } from "../api/config"
import { useState } from "react"
import to from "await-to-js"
import { useBoolean } from 'ahooks'

const useRecordingPath = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean(false)
  const [check, setCheckKey] = useState('')
  const [path, setPath] = useState('')
  const [err, setErr] = useState(null)
  const editPath = (path) => {
    setCheckKey('')
    setErr(null)
    setPath(path)
  }
  const getPath = async () => {
    setTrue()
    const [err, res] = await to(getRecordingPath())
    setPath(res?.data?.data)
    setFalse()
    return [err, res]
  }

  const checkPath = async () => {
    setTrue()
    const [err, res] = await to(setRecordingPath({ path }))
    if (res?.data?.data) {
      setCheckKey(res?.data?.data)
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

  const checkAndApplyPath = async () => {
    if (!path) { return }
    setTrue()
    const [checkErr, checkRes] = await checkPath()
    if (checkErr) { setErr(checkErr); setFalse(); return [checkErr,] }
    const { data: check } = checkRes
    const [err, res] = await to(setRecordingPath({ path, check }))
    setFalse()
    return [err, res?.data]
  }

  return { getPath, checkPath, applyPath, checkAndApplyPath, isLoading, err, path, editPath }

}
export default useRecordingPath