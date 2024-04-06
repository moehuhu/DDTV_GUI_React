import { createTask, cancelTask } from '@/api/rec_task'
import { useBoolean } from 'ahooks'
import to from 'await-to-js'
import Opcode from "../enums/opcode"
import useWebSocketMessage from './useWebSocketMessage'

const useRecordTask = (onLoadingEnd) => {
    const [isLoading, { setTrue, setFalse }] = useBoolean()
    const socket = useWebSocketMessage()

    const createRecTask = async (uid) => {
        setTrue()
        const [err, res] = await to(createTask({ uid, state: true }))
        setFalse()
        onLoadingEnd?.()
        return [err, res]
    }
    const cancelRecTask = async (uid) => {
        const checkCancelRes = (e) => {
            const isCancelSuccess = Opcode.RecordingEnd == e?.code
            const isThisCancelTask = e?.data?.UID == uid
            if (!isCancelSuccess || !isThisCancelTask) { return }
            setFalse()
            onLoadingEnd?.()
            socket.removeEventListener('message', checkCancelRes)
        }
        socket.addEventListener('message', checkCancelRes)
        setTrue()
        const [err, res] = await to(cancelTask({ uid, state: false }))
        return [err, res]
    }
    return { isLoading, createRecTask, cancelRecTask }
}
export default useRecordTask