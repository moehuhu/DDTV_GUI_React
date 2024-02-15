import { useState } from "react";
import to from "await-to-js";
import { doReLogin } from "../api/login";

const useRelogin = () => {
  const [err, setError] = useState()
  const [res, setRes] = useState()
  const relogin = async () => {
    const [err, res] = await to(doReLogin())
    if (err) { console.error(err) }
    setError(err)
    setRes(res)
    return [err, res]
  }
  return [res, relogin]
}
export default useRelogin