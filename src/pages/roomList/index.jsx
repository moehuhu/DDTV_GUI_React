import { useState } from 'react';
import { useAsyncEffect, useInterval } from 'ahooks';
import useUrlState from '@ahooksjs/use-url-state';
import { List, Pagination, message } from 'antd';
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
    pageSizeOptions={[4, 8, 12, 16, 24, 32, 48, 64]}
    onShowSizeChange={(current, size) => { setPageSize(size); setPageState({ current }) }}
    showSizeChanger
    showQuickJumper
  />
  const grid = { xs: 1, sm: 1, md: 1, lg: 2, xl: 3, xxl: 4, }
  const list = <List
    grid={grid}
    header={header}
    renderItem={renderItem}
    footer={footer}
    bordered={false}
    dataSource={roomInfoList}
  />

  return <div className='room-list'>
    {contextHolder}
    {list}
    {addRoomModal}
    {setRoomModal}
  </div>
}
export default Rooms