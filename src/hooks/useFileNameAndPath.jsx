import { getFileNameAndPath, setFileNameAndPath } from "../api/config"
import { useState } from "react"
import to from "await-to-js"
import { useBoolean } from 'ahooks'

const useRecordingPath = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean(false)
  const [check, setCheckKey] = useState('')
  const [pathName, setPathName] = useState('')
  const [err, setErr] = useState(null)
  const editPath = (pathName) => {
    setCheckKey('')
    setErr(null)
    setPathName(pathName)
  }
  const getPath = async () => {
    setTrue()
    const [err, res] = await to(getFileNameAndPath())
    setPathName(res?.data?.data)
    setFalse()
    return [err, res]
  }

  const checkPath = async () => {
    setTrue()
    const [err, res] = await to(setFileNameAndPath({ path_and_format: pathName }))
    const checkKey = res?.data?.data
    if (checkKey && checkKey != '错误') {
      setCheckKey(checkKey)
    }
    setFalse()
    return [err, res?.data]
  }

  const applyPath = async () => {
    setTrue()
    const [err, res] = await to(setFileNameAndPath({ path_and_format: pathName, check }))
    setFalse()
    return [err, res?.data]
  }

  const checkAndApplyPath = async () => {
    if (!pathName) { return }
    setTrue()
    const [checkErr, checkRes] = await checkPath()
    if (checkErr || checkRes?.data == '错误') {
      setErr(checkErr);
      setFalse();
      return [checkErr,]
    }
    const { data: check } = checkRes
    const [err, res] = await to(setFileNameAndPath({ path_and_format: pathName, check }))
    setFalse()
    return [err, res?.data]
  }

  return { getPath, checkPath, applyPath, checkAndApplyPath, isLoading, err, pathName, editPath }

}
export default useRecordingPath