import { useState } from "react";
import to from "await-to-js";
import { doReLogin } from "../api/login";

const useRelogin = () => {
  const [err, setError] = useState()
  if (err) { console.error(err) }
  const [res, setRes] = useState()
  const relogin = async () => {
    const [err, res] = await to(doReLogin())
    setError(err)
    setRes(res)
    return [err, res]
  }
  return [res, relogin]
}
export default useRelogin