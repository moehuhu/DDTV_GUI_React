import { useState } from "react"
import { useBoolean } from 'ahooks'
import to from "await-to-js"
import { getFileTree } from '@/api/file'

const useFileTree = () => {
    const [err, setError] = useState(null)
    const [res, setRes] = useState(null)
    const [isLoading, { setTrue, setFalse }] = useBoolean(false)
    const getTree = async () => {
        setTrue()
        const [err, res] = await to(getFileTree())
        setFalse()
        setError(err)
        setRes(res)
        return [err, res]
    }
    return { err, res, isLoading, getTree }
}
export default useFileTree