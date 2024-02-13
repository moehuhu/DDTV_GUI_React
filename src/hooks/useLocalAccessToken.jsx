import { useInterval } from "ahooks"
import { useState } from "react"

const useLocalAccessToken = () => {
  const initialKeyId = localStorage.getItem('AccessKeyId')
  const initialKeySecret = localStorage.getItem('AccessKeySecret')
  const [accessKeyid, setAccessKeyId] = useState(initialKeyId)
  const [accessKeySecret, setAccessKeySecret] = useState(initialKeySecret)
  const getLocalAccessToken = () => {
    const accessKeyid = localStorage.getItem('AccessKeyId')
    const accessKeySecret = localStorage.getItem('AccessKeySecret')
    setAccessKeyId(accessKeyid)
    setAccessKeySecret(accessKeySecret)
  }
  useInterval(getLocalAccessToken, 1000)
  return { accessKeyid, accessKeySecret }
}
export default useLocalAccessToken