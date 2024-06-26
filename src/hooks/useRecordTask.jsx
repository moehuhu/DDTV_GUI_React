import { createTask, cancelTask } from '@/api/rec_task'
import { useBoolean } from 'ahooks'
import to from 'await-to-js'
import Opcode from "../enums/opcode"
import useWebSocketMessage from './useWebSocketMessage'

const useRecordTask = (onLoadingEnd) => {
    const [isLoading, { setTrue, setFalse }] = useBoolean()
    const socket = useWebSocketMessage()
    const stopLoadingAndRefresh = () => {
        setFalse()
        onLoadingEnd?.()
    }
    const createRecTask = async (uid) => {
        const checkAddSuccess = (data) => {
            const isThisTask = data?.UID == uid
            if (!isThisTask) { return }
            const isDownload = data?.DownInfo?.IsDownload
            if (!isDownload) { stopLoadingAndRefresh() }
            socket.removeEventListener(Opcode.SuccessfullyAddedRecordingTask, checkAddSuccess)
        }
        const checkRecordingStart = (data) => {
            const isThisTask = data?.UID == uid
            if (!isThisTask) { return }
            stopLoadingAndRefresh()
            socket.removeEventListener(Opcode.StartRecording, checkRecordingStart)
        }
        socket.addEventListener(Opcode.SuccessfullyAddedRecordingTask, checkAddSuccess)
        socket.addEventListener(Opcode.StartRecording, checkRecordingStart)
        setTrue()
        const [err, res] = await to(createTask({ uid, state: true }))
        return [err, res]
    }
    const cancelRecTask = async (uid) => {
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