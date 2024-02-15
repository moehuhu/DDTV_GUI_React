import to from "await-to-js"
import { useState } from "react"
import { useBoolean } from 'ahooks'
import { delRoom } from '@/api/set_room'
const useDelRoom = () => {
    const [err, setError] = useState(null)
    const [res, setRes] = useState(null)
    const [isLoading, { setTrue, setFalse }] = useBoolean(false)

    const deleteRoom = async (uid) => {
        setTrue()
        const [err, res] = await to(delRoom({ uid }))
        if (err) { console.error(err) }
        setFalse()
        setError(err)
        setRes(res)
        return [err, res]
    }
    return { err, res, isLoading, deleteRoom }
}
export default useDelRoom