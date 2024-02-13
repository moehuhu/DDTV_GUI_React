import { getRoomInfo } from '@/api/get_room'
import { useBoolean } from 'ahooks'
import { useState } from 'react'
import to from 'await-to-js'
const useRoomInfo = () => {
    const [err, setError] = useState(null)
    const [roomInfo, setRoomInfo] = useState(null)
    const [isLoading, { setTrue, setFalse }] = useBoolean(false)
    const getRoom = async (uid) => {
        setTrue()
        const [err, res] = await to(getRoomInfo({ uid }))
        const roomInfo = res?.data?.data
        setError(err)
        setRoomInfo(roomInfo)
        setFalse()
        return roomInfo
    }
    return { isLoading, getRoom, err, roomInfo }
}
export default useRoomInfo