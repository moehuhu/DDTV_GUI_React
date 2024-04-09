import RoomCard from './RoomCard/index';
import AddRoomModal from './AddRoomModal';
import SetRoomModal from './SetRoomModal';
import useDetailedRoomInfoList from '../../hooks/useDetailedRoomInfoList'
import RoomListHeader from './RoomListHeader';
import { useSystemSettingsStore } from '../../SystemSettingsStore';
import { useMemo, useState, useRef } from 'react';
import { useAsyncEffect, useInterval, useResponsive, useUpdateEffect } from 'ahooks';
import { useTranslation } from 'react-i18next';
import useUrlState from '@ahooksjs/use-url-state';
import { theme, Pagination, Progress, App } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash'


const RoomList = () => {
  const { token } = theme.useToken()
  const { message } = App.useApp()
  const { t } = useTranslation()
  const { isLoading, total, roomInfoList, refreshRoomInfoList } = useDetailedRoomInfoList()
  const [pageState, setPageState] = useUrlState({ current: 1, searchType: 'All', search: undefined })
  const listRef = useRef(null)
  useUpdateEffect(() => {
    if (!listRef?.current?.scrollTop) { return }
    listRef.current.scrollTop = '0px'
  }, [pageState])
  const { current, searchType, search } = pageState
  const { pageSize, setPageSize } = useSystemSettingsStore(state => state)
  const refreshPage = async () => {
    const [err, res] = await refreshRoomInfoList({ ...pageState, pageSize })
    if (err) { message.error(err?.message) }
    return [err, res]
  }
  const { isAutoRefresh, autoRefreshIntervalSeconds } = useSystemSettingsStore(state => state)
  const [willRefreshTime, setWillRefreshTime] = useState(null)
  const [timePercent, setTimePercent] = useState(0.0)
  const calculatePercent = () => {
    const percent = ((willRefreshTime?.diff?.(dayjs(), 'second', true) || 0.0) / (autoRefreshIntervalSeconds - 1.0))
    setTimePercent(percent * 100)
  }
  const autoRefresh = async () => {
    if (!isAutoRefresh) return;
    calculatePercent()
    if (dayjs().diff(willRefreshTime, 'second') < 0) { return }
    const [, res] = await refreshPage()
    if (res?.data) {
      setWillRefreshTime(dayjs().add(autoRefreshIntervalSeconds, 'second'))
    }
  }
  useInterval(autoRefresh, 1000)
  useAsyncEffect(refreshPage, [pageState, pageSize])

  const [addingRoom, setAddingRoom] = useState({})
  const [editingRoom, setEditingRoom] = useState({})

  const progress = <Progress
    type='circle'
    percent={timePercent}
    showInfo={false}
    size={20}
  />
  const refreshed = isAutoRefresh && <div className="refreshed-text" style={{ color: token.colorTextTertiary }}>
    {willRefreshTime?.subtract(autoRefreshIntervalSeconds, 'second')?.format?.('HH:mm:ss')} {t('Refreshed')} {progress}
  </div>
  const header = <div className="header" style={{ borderBlockEnd: `1px solid ${token.colorBorderSecondary}` }}>
    <RoomListHeader
      isLoading={isLoading}
      setPageState={setPageState}
      searchType={searchType}
      search={search}
      setAddingRoom={setAddingRoom}
    />
    {refreshed}
  </div>
  const addRoomModal = <AddRoomModal
    message={message}
    addingRoom={addingRoom}
    setAddingRoom={setAddingRoom}
    refreshPage={refreshPage}
  />
  const setRoomModal = <SetRoomModal
    message={message}
    editingRoom={editingRoom}
    setEditingRoom={setEditingRoom}
    refreshPage={refreshPage}
  />
  const uidMapper = item => item?.userInfo?.uid
  const responsive = useResponsive();
  const columnCount = useMemo(() => _(responsive).countBy(value => value == true).value()['true'] || 1, [responsive])
  const widthPercent = `${100.0 / columnCount}%`
  const renderItem = (item) => <div
    className="card-container"
    style={{ width: widthPercent, maxWidth: widthPercent }}
    key={uidMapper(item)}>
    <RoomCard
      {...item}
      message={message}
      refreshPage={refreshPage}
      setEditingRoom={setEditingRoom}
    />
  </div>
  const footer = <div className="footer" style={{
    borderBlockStart: `1px solid ${token.colorBorderSecondary}`,
    borderBlockEnd: `1px solid ${token.colorBorderSecondary}`
  }}>
    <Pagination
      current={current}
      pageSize={pageSize}
      total={total}
      locale={{
        items_per_page: t('itemsPerPage'),
        jump_to: t('jumpTo'),
        jump_to_confirm: t('jumpToConfirm'),
        page: t('Page'),
        prev_page: t('prevPage'),
        next_page: t('nextPage'),
        prev_5: t('prev5'),
        next_5: t('next5'),
        prev_3: t('prev3'),
        next_3: t('next3'),
        page_size: t('PageSize')
      }}
      onChange={(current) => { setPageState({ current }) }}
      pageSizeOptions={[8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80]}
      onShowSizeChange={(current, size) => { setPageSize(size); setPageState({ current }) }}
      showSizeChanger
      showQuickJumper
    />
  </div>

  return <>
    {addRoomModal}
    {setRoomModal}
    {header}
    <div className="list" ref={listRef}>
      {roomInfoList?.map(renderItem)}
    </div>
    {footer}
  </>

}
export default RoomList