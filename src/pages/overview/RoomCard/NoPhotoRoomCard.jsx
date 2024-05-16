import { Card, Tag, Statistic, Tooltip } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import RoomActions from './RoomActions';
import useOpenBilibiliPage from '../../../hooks/useOpenBilibiliPage';
import { useMemo, useState } from 'react';
import { useInterval } from 'ahooks';
import bytes from 'bytes';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'
import { useTranslation } from 'react-i18next';
dayjs.extend(duration)
const { Meta } = Card;

const NoPhotoRoomCard = (item) => {
  const { roomInfo, userInfo, taskStatus } = item
  const { t } = useTranslation()
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
  const basicInfo = <div className='basic-info' >
    {user}
    <RoomActions {...item} />
  </div >
  const rateStr = `${bytes(currentDownloadRate, { unitSeparator: ' ' })} / s`
  const sizeStr = `${bytes(currentDownloadSize, { unitSeparator: ' ' })}`
  const liveInfo = roomInfo?.liveStatus ? <div className='live-info'>
    <span><Tag color="red">{t('Live')}</Tag></span>
    <Statistic className='active' value={liveDuration} />
  </div> : <div className='live-info'>
    <span><Tag color="gray">{t('NotLive')}</Tag></span>
    <Statistic value={liveDuration} />
  </div>
  const recordingInfo = taskStatus?.isDownload && <Tooltip title={sizeStr}>
    <div className='recording-info'>
      <span><Tag color="blue">{t('LiveAndRecording')}</Tag></span>
      <Statistic className='active' value={rateStr} />
    </div>
  </Tooltip>
  const otherInfo = <div className='other-info'>
    {taskStatus?.isDownload ? recordingInfo : liveInfo}
  </div>
  const info = <div className='info'>
    {basicInfo}
    {otherInfo}
  </div>
  return <Card className='no-photo-card'>
    {info}
  </Card>
}
export default NoPhotoRoomCard