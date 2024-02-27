import { Avatar, List } from "antd"
import { useTranslation } from "react-i18next"
const { Item } = List
const RoomInfo = ({ item }) => {
    const { roomInfo, userInfo } = item
    const { t } = useTranslation()
    const noAvatar = 'https://i0.hdslb.com/bfs/face/member/noface.jpg@52w_52h_1c_1s.webp'
    const avatar = <Avatar src={roomInfo?.face || noAvatar} />
    const title = <span>{userInfo?.name}</span>
    const description = <span>{`UID: ${userInfo?.uid}    ${t('roomID')}: ${roomInfo?.roomId}`}</span>
    return <Item className="room-info">
        <Item.Meta avatar={avatar} title={title} description={description} />
    </Item>
}
export default RoomInfo