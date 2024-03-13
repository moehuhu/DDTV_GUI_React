import { useState } from "react"
import to from "await-to-js"
import { useBoolean } from 'ahooks'
import { getLoginUrl, doReLogin, getLoginStatus } from "../api/login"

const useLoginBiliBili = ({ loginSuccess }) => {
  const [isLoading, { setTrue, setFalse }] = useBoolean(false)
  const [loginStatus, setLoginStatus] = useState(null)
  const [loginURL, setLoginURL] = useState('')
  const relogin = async () => {
    setTrue()
    setLoginURL('')
    const [err, res] = await to(doReLogin())
    setFalse()
    return [err, res]
  }
  const getLoginURL = async () => {
    setTrue()
    const [err, res] = await to(getLoginUrl())
    setLoginURL(res?.data?.data)
    setFalse()
    return [err, res?.data?.data]
  }
  const checkLoginStatus = async () => {
    setTrue()
    const [err, res] = await to(getLoginStatus())
    if (loginStatus === false && res?.data?.data === true) {
      loginSuccess?.()
    }
    setLoginStatus(res?.data?.data)
    setFalse()
    return [err, res?.data?.data]
  }

  return { isLoading, loginURL, loginStatus, getLoginURL, relogin, checkLoginStatus }
}
export default useLoginBiliBili