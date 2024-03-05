import { getRoomInfo } from '@/api/get_room'
import { useBoolean } from 'ahooks'
import { useState } from 'react'
import to from 'await-to-js'
const useRoomInfo = () => {
    const [roomInfo, setRoomInfo] = useState(null)
    const [isLoading, { setTrue, setFalse }] = useBoolean(false)
    const getRoomByUID = async (uid) => {
        setTrue()
        const [err, res] = await to(getRoomInfo({ uid }))
        const roomInfo = res?.data?.data
        setRoomInfo(roomInfo)
        setFalse()
        return [err, roomInfo]
    }
    const getRoomByRoomID = async (room_id) => {
        setTrue()
        const [err, res] = await to(getRoomInfo({ room_id }))
        const roomInfo = res?.data?.data
        setRoomInfo(roomInfo)
        setFalse()
        return [err, roomInfo]
    }
    return { isLoading, getRoomByUID, getRoomByRoomID, roomInfo }
}
export default useRoomInfo