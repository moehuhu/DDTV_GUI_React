import type { SearchType } from '@/enums/search_type'
import type { Response, AtLeastOne } from '@/types'
import type { CompleteRoomInfoData } from '@/types/response'
import { instance } from './instance'

export function getDetailedRoomInfoList(data: {
  quantity?: number
  page?: number
  type?: SearchType
  screen_name?: string
}) {
  return instance.post<Response<CompleteRoomInfoData>>(
    'get_rooms/batch_complete_room_information',
    data
  )
}

export function getBasicRoomInfoList(data: {
  quantity?: number
  page?: number
  type?: SearchType
  screen_name?: string
}) {
  return instance.post<Response<any>>('get_rooms/batch_basic_room_information', data)
}

export function getRoomInfo(data: AtLeastOne<{ uid: bigint; room_id: number }>) {
  return instance.post<Response<any>>('get_rooms/room_information', data)
}
