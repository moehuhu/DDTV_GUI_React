import { Badge, Card } from 'antd'
import { useTranslation } from 'react-i18next';
import { BellFilled } from '@ant-design/icons';
import RoomCover from './RoomCover';
import RoomUser from './RoomUser';
import RoomActions from './RoomActions';

const RoomCard = (item) => {
  const { roomInfo, userInfo } = item
  const { t } = useTranslation()
  const { isAutoRec, isRemind } = userInfo

  const buttons = <RoomActions {...item} />
  const cover = <RoomCover {...item} />
  const user = <RoomUser {...item} />
  const card = <Card cover={cover} bordered={true}  >
    {user}
    {buttons}
  </Card>

  const { liveStatus } = roomInfo
  const liveStatusWrapper = (component) => liveStatus ?
    <Badge offset={[-20, 0]} count={t('Live')}>{component}</Badge>
    : component
  const autoRecStatusWrapper = component => (isAutoRec || isRemind) ?
    <Badge.Ribbon
      style={{ top: 16 }}
      text={<>{isRemind && <BellFilled />}{isAutoRec && t("isAutoRec")}</>}>
      {component}
    </Badge.Ribbon>
    : component
  const roomCard = autoRecStatusWrapper(liveStatusWrapper(card))

  return <div className='room-card'>{roomCard}</div>
}
export default RoomCard
