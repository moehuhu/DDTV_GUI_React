import type { Response, AtLeastOne } from '@/types'
import { instance } from './instance'

export function cancelTask(data: AtLeastOne<{ uid: bigint; room_id: number }>) {
  return instance.post<Response<any>>('rec_task/cancel_task', data)
}

export function createTask(data: AtLeastOne<{ uid: bigint; room_id: number }>) {
  return instance.post<Response<any>>('rec_task/single_task', data)
}

export function cutTask(data: AtLeastOne<{ uid: bigint; room_id: number }>) {
  return instance.post<Response<any>>('rec_task/cut_task', data)
}