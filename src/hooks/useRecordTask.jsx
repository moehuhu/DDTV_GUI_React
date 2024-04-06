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
        const stopLoadingAndRefresh = () => {
            setFalse()
            onLoadingEnd?.()
        }
        const checkCancelSuccess = (data) => {
            const isThisTask = data?.UID == uid
            if (!isThisTask) { return }
            const isDownload = data?.DownInfo?.IsDownload
            if (!isDownload) { stopLoadingAndRefresh() }
            socket.removeEventListener(Opcode.CancelRecordingSuccessful, checkCancelSuccess)
        }
        const checkRecordingEnd = (data) => {
            const isThisTask = data?.UID == uid
            if (!isThisTask) { return }
            stopLoadingAndRefresh()
            socket.removeEventListener(Opcode.RecordingEnd, checkRecordingEnd)
        }
        socket.addEventListener(Opcode.CancelRecordingSuccessful, checkCancelSuccess)
        socket.addEventListener(Opcode.RecordingEnd, checkRecordingEnd)
        setTrue()
        const [err, res] = await to(cancelTask({ uid, state: false }))
        return [err, res]
    }
    return { isLoading, createRecTask, cancelRecTask }
}
export default useRecordTask