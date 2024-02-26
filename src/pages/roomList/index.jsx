import { useState } from 'react';
import { useAsyncEffect, useInterval } from 'ahooks';
import useUrlState from '@ahooksjs/use-url-state';
import { List, Pagination, message, ConfigProvider } from 'antd';
import RoomCard from './RoomCard/index';
import AddRoomModal from './AddRoomModal';
import SetRoomModal from './SetRoomModal';
import useDetailedRoomInfoList from '../../hooks/useDetailedRoomInfoList';
import './style.css'
import RoomListHeader from './RoomListHeader';
import { useSystemSettingsStore } from '../../SystemSettingsStore';

const Rooms = () => {
  const { isLoading, total, roomInfoList, refreshRoomInfoList } = useDetailedRoomInfoList()
  const [pageState, setPageState] = useUrlState({ current: 1, searchType: 'All', search: undefined })
  const { current, searchType, search } = pageState
  const { pageSize, setPageSize } = useSystemSettingsStore(state => state)
  const refreshPage = () => refreshRoomInfoList({ ...pageState, pageSize })

  const { isAutoRefresh, autoRefreshIntervalSeconds } = useSystemSettingsStore(state => state)
  useInterval(() => isAutoRefresh && refreshPage?.(), autoRefreshIntervalSeconds * 1000)
  useAsyncEffect(refreshPage, [pageState, pageSize])

  const [addingRoom, setAddingRoom] = useState({})
  const [editingRoom, setEditingRoom] = useState({})

  const header = <RoomListHeader
    isLoading={isLoading}
    setPageState={setPageState}
    searchType={searchType}
    search={search}
    setAddingRoom={setAddingRoom}
  />
  const [messageApi, contextHolder] = message.useMessage();
  const addRoomModal = <AddRoomModal
    messageApi={messageApi}
    addingRoom={addingRoom}
    setAddingRoom={setAddingRoom}
    refreshPage={refreshPage}
  />
  const setRoomModal = <SetRoomModal
    messageApi={messageApi}
    editingRoom={editingRoom}
    setEditingRoom={setEditingRoom}
    refreshPage={refreshPage}
  />
  const renderItem = (item) => <List.Item>
    <RoomCard
      {...item}
      messageApi={messageApi}
      refreshPage={refreshPage}
      setEditingRoom={setEditingRoom}
    />
  </List.Item>
  const footer = <Pagination
    current={current}
    pageSize={pageSize}
    total={total}
    onChange={(current) => { setPageState({ current }) }}
    pageSizeOptions={[8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80]}
    onShowSizeChange={(current, size) => { setPageSize(size); setPageState({ current }) }}
    showSizeChanger
    showQuickJumper
  />
  const grid = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 5, gutter: 16 }
  const list = <ConfigProvider
    theme={{
      token: {
        screenXXL: 2000,
        screenXXLMin: 2000,
        screenXLMax: 1999,
        screenXL: 1600,
        screenXLMin: 1600,
        screenLGMax: 1599,
        screenLG: 1200,
        screenLGMin: 1200,
        screenMDMax: 1199,
        screenMD: 992,
        screenMDMin: 992,
        screenSMMax: 991,
        screenSM: 768,
        screenSMMin: 768,
        screenXSMax: 767,
        screenXS: 576,
        screenXSMin: 576,
      },
    }}
  >
    <List
      grid={grid}
      header={header}
      renderItem={renderItem}
      footer={footer}
      bordered={false}
      dataSource={roomInfoList}
    />
  </ConfigProvider>

  return <div className='room-list'>
    {contextHolder}
    {list}
    {addRoomModal}
    {setRoomModal}
  </div>
}
export default Rooms