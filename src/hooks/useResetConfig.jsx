import { resetConfig, reinitializeConfig } from "../api/config"
import { useState } from "react"
import { useBoolean } from 'ahooks'
import { useTranslation } from "react-i18next"
import to from "await-to-js"

const useResetConfig = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean()
  const { t } = useTranslation()
  const [checkReinitializeData, setCheckReinitialize] = useState(null)
  const reset = async () => {
    setTrue()
    const [err, res] = await to(resetConfig())
    setFalse()
    return [err, res]
  }

  const checkReinitialize = async () => {
    setTrue()
    const [err, res] = await to(reinitializeConfig())
    const checkKey = res?.data?.data
    const checkFailed = !checkKey || checkKey == "错误"
    const title = checkFailed ? t('Error') : t('Warning')
    const message = t("Are you sure to delete all rooms, settings and user accounts?")
    setCheckReinitialize({ ...(res?.data || {}), title, message, checkFailed })
    setFalse()
    return [err, res?.data]
  }

  const applyReinitialize = async () => {
    const checkKey = checkReinitializeData?.data
    if (!checkKey || checkKey == "错误") { return }
    setTrue()
    const [err, res] = await to(reinitializeConfig({ check: checkKey }))
    setCheckReinitialize(null)
    setFalse()
    return [err, res?.data]
  }
  return { isLoading, reset, checkReinitialize, setCheckReinitialize, checkReinitializeData, applyReinitialize }
}
export default useResetConfig