import { createTask, cancelTask } from '@/api/rec_task'
import { useBoolean } from 'ahooks'
import to from 'await-to-js'
import usePolling from './usePolling'
import useRoomInfo from './useRoomInfo'

const useRecordTask = () => {
    const [isLoading, { setTrue, setFalse }] = useBoolean()
    const { getRoomByUID } = useRoomInfo()
    const checkTaskStatus = (uid, IsDownload) => async () => {
        const [err, roomInfo] = await getRoomByUID(uid)
        return (roomInfo?.DownInfo?.IsDownload == IsDownload) || err?.message
    }
    const polling = usePolling()
    const createRecTask = async (uid) => {
        setTrue()
        const [err, res] = await to(createTask({ uid, state: true }))
        setFalse()
        return [err, res]
    }
    const cancelRecTask = async (uid) => {
        setTrue()
        const [err, res] = await to(cancelTask({ uid, state: false }))
        await to(polling(checkTaskStatus(uid, false), { interval: 1000, maxRetries: 59 }))
        setFalse()
        return [err, res]
    }
    return { isLoading, createRecTask, cancelRecTask }
}
export default useRecordTask