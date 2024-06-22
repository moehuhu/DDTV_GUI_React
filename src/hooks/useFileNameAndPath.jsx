import { getFileNameAndPath, setFileNameAndPath } from "../api/config"
import { useState } from "react"
import { useBoolean } from 'ahooks'
import { useTranslation } from "react-i18next"
import to from "await-to-js"

const useRecordingPath = () => {
  const { t } = useTranslation()
  const [isLoading, { setTrue, setFalse }] = useBoolean(false)
  const [checkNameData, setCheckNameData] = useState(null)
  const [majorDirectory, setMajorDirectory] = useState('')
  const [minorDirectory, setMinorDirectory] = useState('')
  const [filename, setFilename] = useState('')
  const editFilename = (filename) => {
    setCheckNameData(null)
    setFilename(filename)
  }
  const getFilenameAndPath = async () => {
    setTrue()
    const [err, res] = await to(getFileNameAndPath())
    setMajorDirectory(res?.data?.data?.Item2)
    setMinorDirectory(res?.data?.data?.Item3)
    setFilename(res?.data?.data?.Item4)
    setFalse()
    return [err, res]
  }

  const checkFilenameAndPath = async () => {
    setTrue()
    const [err, res] = await to(setFileNameAndPath({
      default_liver_folder_name: majorDirectory,
      default_data_folder_name: minorDirectory,
      default_file_name: filename
    }))
    const checkKey = res?.data?.data
    const checkFailed = !checkKey || checkKey == "错误"
    const title = checkFailed ? t('Error') : t('Warning')
    const message = checkFailed ? t('Verification failed, please check the filename format')
      : t('Are you sure to modify the filename format?')
    setCheckNameData({ ...(res?.data || {}), title, message, checkFailed })
    setFalse()
    return [err, res?.data]
  }

  const applyFilenameAndPath = async () => {
    const checkKey = checkNameData?.data
    if (!checkKey || checkKey == "错误") { return }
    setTrue()
    const [err, res] = await to(setFileNameAndPath({
      default_liver_folder_name: majorDirectory,
      default_data_folder_name: minorDirectory,
      default_file_name: filename,
      check: checkKey
    }))
    setCheckNameData(null)
    setFalse()
    return [err, res?.data]
  }

  return {
    getFilenameAndPath, checkFilenameAndPath, checkNameData, setCheckNameData,
    applyFilenameAndPath, isLoading, majorDirectory, minorDirectory, filename, editFilename
  }

}
export default useRecordingPath