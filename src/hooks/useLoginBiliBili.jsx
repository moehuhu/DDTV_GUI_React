import { useState } from "react"
import to from "await-to-js"
import { useBoolean } from 'ahooks'
import { getLoginUrl, doReLogin, getLoginStatus } from "../api/login"

const useLoginBiliBili = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean(false)
  const [err, setError] = useState(null)
  const [loginStatus, setLoginStatus] = useState(null)
  const [loginURL, setLoginURL] = useState('')
  const relogin = async () => {
    setTrue()
    const [err, res] = await to(doReLogin())
    if (err) { console.error(err) }
    setError(err)
    setFalse()
    return [err, res]
  }
  const getQrcode = async () => {
    setTrue()
    const [err, res] = await to(getLoginUrl())
    if (err) { console.error(err) }
    setError(err)
    setLoginURL(res?.data)
    setFalse()
    return [err, res?.data]
  }
  const checkLoginStatus = async () => {
    setTrue()
    const [err, res] = await to(getLoginStatus())
    if (err) { console.error(err) }
    setError(err)
    setLoginStatus(res?.code)
    setFalse()
    return [err, res]
  }

  return { err, isLoading, loginURL, loginStatus, getQrcode, relogin, checkLoginStatus }
}
export default useLoginBiliBili