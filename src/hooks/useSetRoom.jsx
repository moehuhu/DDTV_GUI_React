import to from "await-to-js"
import { useState } from "react"
import { useBoolean } from 'ahooks'
import { modifyRoomSettings } from "../api/set_room"
import usePolling from './usePolling'
import useRoomInfo from './useRoomInfo'

const useSetRoom = () => {
    const [err, setError] = useState(null)
    const [res, setRes] = useState(null)
    const [isLoading, { setTrue, setFalse }] = useBoolean(false)
    const polling = usePolling()
    const { getRoomByUID } = useRoomInfo()
    const checkAddStatus = (params) => async () => {
        const { uid, } = params
        const [err, roomInfo] = await to(getRoomByUID(uid))
        const keys = ['AutoRec', 'Remind', 'RecDanmu']
        return (keys.every(key => params[key] == roomInfo[`Is${key}`])) || err?.message
    }
    const setRoom = async (params) => {
        setTrue()
        const { uid, IsAutoRec: AutoRec, IsRemind: Remind, IsRecDanmu: RecDanmu } = params
        const args = { uid, AutoRec, Remind, RecDanmu }
        const [err, res] = await to(modifyRoomSettings(args))
        if (err) { console.error(err) }
        await to(polling(checkAddStatus(args), { interval: 1000, maxRetries: 59 }))
        setFalse()
        setError(err)
        setRes(res)
        return [err, res]
    }
    return { err, res, isLoading, setRoom }
}
export default useSetRoom