import to from "await-to-js"
import { useState } from "react"
import { useBoolean } from 'ahooks'
import { addRoom } from '@/api/set_room'
import usePolling from './usePolling'
import useRoomInfo from './useRoomInfo'
import _ from 'lodash'
const useAddRoom = () => {
    const [err, setError] = useState(null)
    const [res, setRes] = useState(null)
    if (err) { console.error(err) }
    const [isLoading, { setTrue, setFalse }] = useBoolean(false)
    const { getRoomByUID, getRoomByRoomID } = useRoomInfo()
    const checkAddStatus = (params) => async () => {
        const { uid, room_id } = params
        const [err, roomInfo] = await to(uid ? getRoomByUID(uid) : getRoomByRoomID(room_id))
        return (roomInfo?.Name) || err?.message
    }
    const polling = usePolling()
    const submitRoom = async (params) => {
        setTrue()
        const mappedParams = _(params)
            .mapKeys((item, key) => _.snakeCase(key))
            .value()
        const [err, res] = await to(addRoom(mappedParams))
        await to(polling(checkAddStatus(mappedParams), { interval: 1000, maxRetries: 59 }))
        setFalse()
        setError(err)
        setRes(res)
        return [err, res]
    }
    return { err, res, isLoading, submitRoom }
}
export default useAddRoom