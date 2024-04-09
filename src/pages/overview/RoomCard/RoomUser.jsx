import { Avatar, Card } from 'antd';
const { Meta } = Card;

import useOpenBilibiliPage from '../../../hooks/useOpenBilibiliPage';

const RoomUser = (item) => {
  const { roomInfo, userInfo } = item
  const [openBiliLiveRoom, openBiliHomepage] = useOpenBilibiliPage(item)
  const { face } = roomInfo
  const noAvatar = 'https://i0.hdslb.com/bfs/face/member/noface.jpg@52w_52h_1c_1s.webp'
  const avatar = <Avatar src={face || noAvatar} />
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
    avatar={avatar}
    title={title}
    description={description}
  />

  return user
}

export default RoomUser