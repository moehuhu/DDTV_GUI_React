import type { Response } from '@/types'
import { instance } from './instance'

export function reloadConfig() {
  return instance.post<Response<any>>('config/reload_configuration')
}
