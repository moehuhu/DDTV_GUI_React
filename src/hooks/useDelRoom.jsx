import to from "await-to-js"
import { useState } from "react"
import { useBoolean } from 'ahooks'
import { delRoom, delRooms } from '@/api/set_room'
const useDelRoom = () => {
    const [res, setRes] = useState(null)
    const [isLoading, { setTrue, setFalse }] = useBoolean(false)

    const deleteRoom = async (uid) => {
        setTrue()
        const [err, res] = await to(delRoom({ uid }))
        if (err) { console.error(err) }
        setFalse()
        setRes(res)
        return [err, res?.data]
    }

    const deleteRooms = async (uid) => {
        setTrue()
        const [err, res] = await to(delRooms({ uid }))
        if (err) { console.error(err) }
        setFalse()
        setRes(res)
        return [err, res?.data]
    }
    return { res, isLoading, deleteRoom, deleteRooms }
}
export default useDelRoom