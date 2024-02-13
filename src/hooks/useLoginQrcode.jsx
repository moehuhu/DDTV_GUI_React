import { useState } from "react";
import to from "await-to-js";
import { getLoginQrcode, doReLogin } from "../api/login";

const blobToBase64 = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result)
    }
    reader.readAsDataURL(blob)
  })
}

const useLoginQrcode = () => {
  const [err, setError] = useState(null)
  if (err) { console.error(err) }
  const [qrcode, setQrcode] = useState(null)
  const refreshQrcode = async () => {
    const [err, res] = await to(getLoginQrcode())
    setError(err)
    if (res) {
      const imageSrc = await blobToBase64(res.data)
      setQrcode(imageSrc)
    }
    return [err, res]
  }
  return [qrcode, refreshQrcode]
}
export default useLoginQrcode