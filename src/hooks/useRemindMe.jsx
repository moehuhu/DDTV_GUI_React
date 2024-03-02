import { setRoomsPromptState } from '@/api/set_room'
import { useBoolean } from 'ahooks'
import to from 'await-to-js'

const useRemindMe = () => {
    const [isLoading, { setTrue, setFalse }] = useBoolean()
    const openRemindMe = async (uid) => {
        setTrue()
        const [err, res] = await to(setRoomsPromptState({ uid, state: true }))
        setFalse()
        return [err, res?.data]
    }
    const closeRemindMe = async (uid) => {
        setTrue()
        const [err, res] = await to(setRoomsPromptState({ uid, state: false }))
        setFalse()
        return [err, res?.data]
    }
    return { isLoading, openRemindMe, closeRemindMe }
}
export default useRemindMe