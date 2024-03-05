import { getDetailedRoomInfoList } from '@/api/get_room'
import { useBoolean } from 'ahooks'
import to from 'await-to-js'
import { useState } from 'react'
import SearchType from '../enums/search_type';
import _ from 'lodash'
const useDetailedRoomInfoList = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean(false)
  const [total, setTotal] = useState(0)
  const [roomInfoList, setRoomInfoList] = useState([])
  const refreshRoomInfoList = async (params = {}) => {
    setTrue()
    const options = _({
      quantity: params?.pageSize,
      page: params?.current,
      type: SearchType[params?.searchType],
      screen_name: params?.search,
    }).pickBy(option => option).value()
    const [err, res] = await to(getDetailedRoomInfoList(options))
    setFalse()
    setTotal(res?.data?.data?.total || 0)
    setRoomInfoList(res?.data?.data?.completeInfoList || [])
    return [err, res?.data]
  }
  return { isLoading, total, roomInfoList, refreshRoomInfoList }
}
export default useDetailedRoomInfoList