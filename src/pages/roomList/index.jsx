import RoomCard from './RoomCard/index';
import AddRoomModal from './AddRoomModal';
import SetRoomModal from './SetRoomModal';
import useDetailedRoomInfoList from '../../hooks/useDetailedRoomInfoList';
import './style.css'
import RoomListHeader from './RoomListHeader';
import { useSystemSettingsStore } from '../../SystemSettingsStore';
import { useMemo, useState } from 'react';
import { useAsyncEffect, useInterval, configResponsive, useResponsive } from 'ahooks';
import { useTranslation } from 'react-i18next';
import useUrlState from '@ahooksjs/use-url-state';
import { theme, Pagination, App } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash'

configResponsive({
  sm: 768,
  md: 992,
  lg: 1280,
  xl: 1600,
  xxl: 2000
});

const Rooms = () => {
  const { token } = theme.useToken()
  const { message } = App.useApp()
  const { t } = useTranslation()
  const { isLoading, total, roomInfoList, refreshRoomInfoList } = useDetailedRoomInfoList()
  const [pageState, setPageState] = useUrlState({ current: 1, searchType: 'All', search: undefined })
  const { current, searchType, search } = pageState
  const { pageSize, setPageSize } = useSystemSettingsStore(state => state)
  const refreshPage = async () => {
    const [err, res] = await refreshRoomInfoList({ ...pageState, pageSize })
    if (err) { message.error(err?.message) }
    return [err, res]
  }
  const { isAutoRefresh, autoRefreshIntervalSeconds } = useSystemSettingsStore(state => state)
  const autoRefresh = async () => {
    if (!isAutoRefresh) return;
    const [, res] = await refreshPage()
    if (res?.data) {
      message.success(t(`${t('Refreshed')} ${dayjs().format('HH:mm:ss')}`))
    }
  }
  useInterval(autoRefresh, autoRefreshIntervalSeconds * 1000)
  useAsyncEffect(refreshPage, [pageState, pageSize])

  const [addingRoom, setAddingRoom] = useState({})
  const [editingRoom, setEditingRoom] = useState({})

  const header = <div className="header" style={{ borderBlockEnd: `1px solid ${token.colorBorderSecondary}` }}>
    <RoomListHeader
      isLoading={isLoading}
      setPageState={setPageState}
      searchType={searchType}
      search={search}
      setAddingRoom={setAddingRoom}
    />
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
  const footer = <div className="footer" style={{ borderBlockStart: `1px solid ${token.colorBorderSecondary}` }}>
    <Pagination
      current={current}
      pageSize={pageSize}
      total={total}
      onChange={(current) => { setPageState({ current }) }}
      pageSizeOptions={[8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80]}
      onShowSizeChange={(current, size) => { setPageSize(size); setPageState({ current }) }}
      showSizeChanger
      showQuickJumper
    />
  </div>

  return <div className='room-list'
    style={{ borderRadius: token.borderRadiusLG }}>
    {addRoomModal}
    {setRoomModal}
    {header}
    <div className="list">
      {roomInfoList?.map(renderItem)}
    </div>
    {footer}
  </div>


}
export default Rooms