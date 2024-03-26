import type { Response } from '@/types'
import { instance } from './instance'

export function reloadConfig() {
  return instance.post<Response<any>>('config/reload_configuration')
}

export function resetConfig() {
  return instance.get<Response<any>>('config/restore_all_settings_to_default')
}

export function setRecordingPath(data: { path?: string; check?: string }) {
  return instance.post<Response<any>>('config/set_recording_path', data)
}

export function getRecordingPath() {
  return instance.get<Response<any>>('config/get_recording_path')
}

export function setFileNameAndPath(data: { path_and_format?: string; check?: string }) {
  return instance.post<Response<any>>('config/set_default_file_path_name_format', data)
}

export function getFileNameAndPath() {
  return instance.get<Response<any>>('config/get_default_file_path_name_format')
}

export function getHLSWaitingTime() {
  return instance.get<Response<any>>('config/get_hls_waiting_time')
}

export function setHLSWaitingTime(data: { time: bigint; }) {
  return instance.post<Response<any>>('config/set_hls_waiting_time', data)
}

export function getAutoRepair() {
  return instance.get<Response<any>>('config/get_automatic_repair')
}

export function setAutoRepair(data: { automatic_repair: boolean; }) {
  return instance.post<Response<any>>('config/set_automatic_repair', data)
}

export function getCoreVersion() {
  return instance.get<Response<any>>('config/get_core_version')
}