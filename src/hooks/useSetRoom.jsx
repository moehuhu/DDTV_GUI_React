import to from "await-to-js"
import { useState } from "react"
import { useBoolean } from 'ahooks'
import { modifyRoomSettings } from "../api/set_room"

const useSetRoom = () => {
    const [res, setRes] = useState(null)
    const [isLoading, { setTrue, setFalse }] = useBoolean(false)
    const setRoom = async (params) => {
        setTrue()
        const { uid, IsAutoRec: AutoRec, IsRemind: Remind, IsRecDanmu: RecDanmu } = params
        const args = { uid, AutoRec, Remind, RecDanmu }
        const [err, res] = await to(modifyRoomSettings(args))
        if (err) { console.error(err) }
        setFalse()
        setRes(res)
        return [err, res]
    }
    return { res, isLoading, setRoom }
}
export default useSetRoom