import { getFileNameAndPath, setFileNameAndPath } from "../api/config"
import { useState } from "react"
import { useBoolean } from 'ahooks'
import { useTranslation } from "react-i18next"
import to from "await-to-js"

const useRecordingPath = () => {
  const { t } = useTranslation()
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
    const checkKey = res?.data?.data
    const checkFailed = !checkKey || checkKey == "错误"
    const title = checkFailed ? t('Error') : t('Warning')
    const message = checkFailed ? t('Verification failed, please check the filename format')
      : t('Are you sure to modify the filename format?')
    setCheckNameData({ ...(res?.data || {}), title, message, checkFailed })
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

  return { getPathName, checkPathName, checkNameData, setCheckNameData, applyPathName, isLoading, pathName, editPathName }

}
export default useRecordingPath