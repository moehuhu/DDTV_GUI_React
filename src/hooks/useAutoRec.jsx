import { setRoomsRecordState } from '@/api/set_room'
import { useBoolean } from 'ahooks'
import to from 'await-to-js'

const useAutoRec = () => {
    const [isLoading, { setTrue, setFalse }] = useBoolean()
    const openAutoRec = async (uid) => {
        setTrue()
        const [err, res] = await to(setRoomsRecordState({ uid, state: true }))
        setFalse()
        return [err, res]
    }
    const closeAutoRec = async (uid) => {
        setTrue()
        const [err, res] = await to(setRoomsRecordState({ uid, state: false }))
        setFalse()
        return [err, res]
    }
    return { isLoading, openAutoRec, closeAutoRec }
}
export default useAutoRec