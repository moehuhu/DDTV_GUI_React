import { useState } from "react"
import to from "await-to-js"
import { getLoginStatus } from "../api/login"
import Code from '../enums/code'

const useLoginStatus = () => {
  const [err, setError] = useState(null)
  const [loginStatus, setLoginStatus] = useState(null)
  const checkLoginStatus = async () => {
    const [err, res] = await to(getLoginStatus())
    if (err) { console.error(err) }
    setError(err)
    setLoginStatus(res)
    return [err, res]
  }

  return [loginStatus, checkLoginStatus]
}
export default useLoginStatus