import { Avatar, List, theme } from "antd"
import { CheckOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
const { Item } = List
const RoomInfo = ({ item, selected, staged, onClick, onDoubleClick }) => {
    const { roomInfo, userInfo } = item
    const { t } = useTranslation()
    const noAvatar = 'https://i0.hdslb.com/bfs/face/member/noface.jpg@52w_52h_1c_1s.webp'
    const avatar = <Avatar src={roomInfo?.face || noAvatar} />
    const title = <span>{userInfo?.name}</span>
    const description = <span>{`UID: ${userInfo?.uid}    ${t('roomID')}: ${roomInfo?.roomId}`}</span>
    const { token } = theme.useToken()
    return <Item
        style={{ background: selected ? token.colorBgTextHover : undefined }}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className={`room-info`}
        extra={staged ? <CheckOutlined /> : null}>
        <Item.Meta avatar={avatar} title={title} description={description} />
    </Item>
}
export default RoomInfo