import { useState } from "react"
import to from "await-to-js"
import { useBoolean } from 'ahooks'
import { getLoginUrl, doReLogin, getLoginStatus } from "../api/login"
import QRCode from 'qrcode'
import LoginStatus from "../enums/login_state"

const useLoginBiliBili = ({ loginSuccess }) => {
  const [isLoading, { setTrue, setFalse }] = useBoolean(false)
  const [err, setError] = useState(null)
  const [loginStatus, setLoginStatus] = useState(null)
  const [loginQrcodeImageURL, setLoginURL] = useState('')
  const relogin = async () => {
    setTrue()
    setLoginURL('')
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
    if (!res?.data?.data) {
      setLoginURL(res?.data)
      setFalse()
      return [err, res]
    }
    const [qrcodeErr, imageDataURL] = await to(QRCode.toDataURL(res?.data?.data))
    if (qrcodeErr) { console.error(qrcodeErr) }
    setError({ err, qrcodeErr })
    setLoginURL(imageDataURL)
    setFalse()
    return [err, imageDataURL]
  }
  const checkLoginStatus = async () => {
    setTrue()
    const [err, res] = await to(getLoginStatus())
    if (err) { console.error(err) }
    setError(err)
    if (loginStatus === false && res?.data?.data === true) {
      loginSuccess?.()
    }
    setLoginStatus(res?.data?.data)
    setFalse()
    return [err, res?.data?.data]
  }

  return { err, isLoading, loginQrcodeImageURL, loginStatus, getQrcode, relogin, checkLoginStatus }
}
export default useLoginBiliBili