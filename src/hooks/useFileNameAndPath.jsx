import { getFileNameAndPath, setFileNameAndPath } from "../api/config"
import { useState } from "react"
import to from "await-to-js"
import { useBoolean } from 'ahooks'

const useRecordingPath = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean(false)
  const [checkNameData, setCheckNameData] = useState(null)
  const [pathName, setPathName] = useState('')
  const editPathName = (pathName) => {
    setCheckNameData(null)
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
    setCheckNameData(res?.data)
    setFalse()
    return [err, res?.data]
  }

  const applyPathName = async () => {
    const checkKey = checkNameData?.data
    if (!checkKey || checkKey == "错误") { return }
    setTrue()
    const [err, res] = await to(setFileNameAndPath({ path_and_format: pathName, check: checkKey }))
    setCheckNameData(null)
    setFalse()
    return [err, res?.data]
  }

  return { getPathName, checkPathName, checkNameData, applyPathName, isLoading, pathName, editPathName }

}
export default useRecordingPath