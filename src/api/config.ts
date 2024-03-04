import type { Response } from '@/types'
import { instance } from './instance'

export function reloadConfig() {
  return instance.post<Response<any>>('config/reload_configuration')
}

export function setRecordingPath(data: { path?: string; check?: string }) {
  return instance.post<Response<any>>('config/set_recording_path', data)
}

export function getRecordingPath() {
  return instance.get<Response<any>>('config/get_recording_path')
}
