import { getRecordingPath, setRecordingPath } from "../api/config"
import { useState } from "react"
import { useBoolean } from 'ahooks'
import { useTranslation } from "react-i18next"
import to from "await-to-js"

const useRecordingPath = () => {
  const { t } = useTranslation()
  const [isLoading, { setTrue, setFalse }] = useBoolean(false)
  const [checkData, setCheckData] = useState(null)
  const [path, setPath] = useState('')
  const editPath = (path) => {
    setCheckData(null)
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
    const checkKey = res?.data?.data
    const checkFailed = !checkKey || checkKey == "错误"
    const title = checkFailed ? t('Error') : t('Warning')
    const message = checkFailed ? t('Verification failed, please check the path format')
      : t('Are you sure to modify the path?')
    setCheckData({ ...(res?.data || {}), title, message, checkFailed })
    setFalse()
    return [err, res?.data]
  }

  const applyPath = async () => {
    const checkKey = checkData?.data
    if (!checkKey || checkKey == "错误") { return }
    setTrue()
    const [err, res] = await to(setRecordingPath({ path, check: checkKey }))
    setCheckData(null)
    setFalse()
    return [err, res?.data]
  }

  return { getPath, checkPath, checkPathData: checkData, applyPath, isLoading, path, editPath }

}
export default useRecordingPath