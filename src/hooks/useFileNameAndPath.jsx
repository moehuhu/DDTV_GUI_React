import { getFileNameAndPath, setFileNameAndPath } from "../api/config"
import { useState } from "react"
import to from "await-to-js"
import { useBoolean } from 'ahooks'

const useRecordingPath = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean(false)
  const [check, setCheckKey] = useState('')
  const [pathName, setPathName] = useState('')
  const [err, setErr] = useState(null)
  const editPathName = (pathName) => {
    setCheckKey('')
    setErr(null)
    setPathName(pathName)
  }
  const getPathName = async () => {
    setTrue()
    const [err, res] = await to(getFileNameAndPath())
    setPathName(res?.data?.data)
    setFalse()
    return [err, res]
  }

  const checkPathName = async () => {
    setTrue()
    const [err, res] = await to(setFileNameAndPath({ path_and_format: pathName }))
    const checkKey = res?.data?.data
    if (checkKey && checkKey != '错误') {
      setCheckKey(checkKey)
    }
    setFalse()
    return [err, res?.data]
  }

  const applyPathName = async () => {
    setTrue()
    const [err, res] = await to(setFileNameAndPath({ path_and_format: pathName, check }))
    setFalse()
    return [err, res?.data]
  }

  const checkAndApplyPathName = async () => {
    if (!pathName) { return }
    setTrue()
    const [checkErr, checkRes] = await checkPathName()
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

  return { getPathName, checkPathName, applyPathName, checkAndApplyPathName, isLoading, err, pathName, editPathName }

}
export default useRecordingPath