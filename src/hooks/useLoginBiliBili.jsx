import { useState } from "react"
import to from "await-to-js"
import { useBoolean, useMount } from 'ahooks'
import { getLoginUrl, doReLogin, getLoginStatus, getLoginUserInfo } from "../api/login"
import useWebSocketMessage from "./useWebSocketMessage"
import Opcode from "../enums/opcode"

const useLoginBiliBili = (props) => {
  const loginSuccess = props?.loginSuccess
  const [isLoading, { setTrue, setFalse }] = useBoolean(false)
  const [loginStatus, setLoginStatus] = useState(null)
  const [loginURL, setLoginURL] = useState('')
  const [userInfo, setUserInfo] = useState(null)
  const socket = useWebSocketMessage()

  const checkLoginStatus = async () => {
    setTrue()
    const [err, res] = await to(getLoginStatus())
    setLoginStatus(res?.data?.data)
    setFalse()
    return [err, res?.data?.data]
  }
  const relogin = async () => {
    setTrue()
    setLoginURL('')
    const [err, res] = await to(doReLogin())
    setFalse()
    return [err, res]
  }
  const getLoginURL = async () => {
    socket.addEventListener('message', e => {
      if (Opcode.LoginSuccessful == e?.code) {
        checkLoginStatus()
        loginSuccess?.()
        socket.removeEventListener('message')
      }
    })
    setTrue()
    const [err, res] = await to(getLoginUrl())
    setLoginURL(res?.data?.data)
    setFalse()
    return [err, res?.data?.data]
  }
  const getLoginUser = async () => {
    setTrue()
    const [err, res] = await to(getLoginUserInfo())
    setUserInfo(res?.data?.data)
    setFalse()
    return [err, res?.data?.data]
  }

  return { isLoading, loginURL, loginStatus, userInfo, getLoginURL, getLoginUser, relogin, checkLoginStatus }
}
export default useLoginBiliBili