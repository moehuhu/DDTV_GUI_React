import { setRoomsDMState } from '@/api/set_room'
import { useBoolean } from 'ahooks'
import to from 'await-to-js'

const useDanmuRec = () => {
    const [isLoading, { setTrue, setFalse }] = useBoolean()
    const openDanmuRec = async (uid) => {
        setTrue()
        const [err, res] = await to(setRoomsDMState({ uid, state: true }))
        setFalse()
        return [err, res?.data]
    }
    const closeDanmuRec = async (uid) => {
        setTrue()
        const [err, res] = await to(setRoomsDMState({ uid, state: false }))
        setFalse()
        return [err, res?.data]
    }
    return { isLoading, openDanmuRec, closeDanmuRec }
}
export default useDanmuRec