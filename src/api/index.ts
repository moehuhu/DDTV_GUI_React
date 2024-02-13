import type { Response } from '@/types'
import { instance } from './instance'

export function getDokidoki() {
  return instance.get<Response<any>>('dokidoki')
}

export function postDokidoki() {
  return instance.post<Response<any>>('dokidoki')
}
