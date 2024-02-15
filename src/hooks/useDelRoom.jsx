import to from "await-to-js"
import { useState } from "react"
import { useBoolean } from 'ahooks'
import { delRoom } from '@/api/set_room'
import _ from 'lodash'
const useDelRoom = () => {
    const [err, setError] = useState(null)
    const [res, setRes] = useState(null)
    if (err) { console.error(err) }
    const [isLoading, { setTrue, setFalse }] = useBoolean(false)

    const deleteRoom = async (uid) => {
        setTrue()
        const [err, res] = await to(delRoom({ uid }))
        setFalse()
        setError(err)
        setRes(res)
        return [err, res]
    }
    return { err, res, isLoading, deleteRoom }
}
export default useDelRoom