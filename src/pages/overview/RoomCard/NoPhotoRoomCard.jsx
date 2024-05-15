import { Card } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import RoomActions from './RoomActions';
import useOpenBilibiliPage from '../../../hooks/useOpenBilibiliPage';
import { useMemo, useState } from 'react';
import { useInterval } from 'ahooks';
import bytes from 'bytes';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
const { Meta } = Card;

const NoPhotoRoomCard = (item) => {
  const { roomInfo, userInfo, taskStatus } = item
  const [currentDownloadRate, setCurrentDownloadRate] = useState(0)
  const [currentDownloadSize, setCurrentDownloadSize] = useState(0)
  const [liveDuration, setLiveDuration] = useState('00:00:00')

  const refreshDownloadInfo = () => {
    if (!taskStatus?.isDownload) {
      setCurrentDownloadRate(0);
      setCurrentDownloadSize(0);
      return
    }
    const targetRate = taskStatus?.downloadRate || 0
    const averageRate = (currentDownloadRate + targetRate) * 0.5
    const targetSize = taskStatus?.downloadSize || 0
    const averageSize = (currentDownloadSize + targetSize) * 0.5
    setCurrentDownloadRate(averageRate)
    setCurrentDownloadSize(averageSize)
  }
  const refreshLivingInfo = () => {
    if (!roomInfo?.liveStatus) { setLiveDuration('00:00:00'); return }
    const startTime = dayjs.unix(roomInfo?.liveTime)
    const duration = dayjs.duration(dayjs().diff(startTime)).format('HH:mm:ss')
    setLiveDuration(duration)
  }
  useInterval(() => {
    if (!roomInfo?.liveStatus) { return }
    if (!taskStatus?.isDownload) {
      refreshLivingInfo()
      return
    }
    refreshDownloadInfo()
  }, 1000)
  const [openBiliLiveRoom, openBiliHomepage] = useOpenBilibiliPage(item)
  const title = <span
    className='link'
    onClick={() => openBiliHomepage()}>
    {userInfo?.name}
  </span>
  const description = <span
    className='link'
    onClick={() => openBiliLiveRoom()}>
    {roomInfo?.title}
  </span>
  const user = <Meta
    title={title}
    description={description}
  />
  const buttons = <RoomActions {...item} />
  const basicInfo = <div className='basic-info' >
    {user}
    {buttons}
  </div >
  const rateStr = `${bytes(currentDownloadRate, { unitSeparator: ' ' })}} / s`
  const sizeStr = `${bytes(currentDownloadSize, { unitSeparator: ' ' })}}`
  const otherInfo = <div className='other-info'>
    { }
  </div>
  return <Card className='no-photo-card'>
    {basicInfo}
    {otherInfo}
  </Card>
}
export default NoPhotoRoomCard