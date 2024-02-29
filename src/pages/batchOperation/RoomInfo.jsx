import { Avatar, theme } from "antd"
import { useTranslation } from "react-i18next"
const StagedRoomInfo = ({ key, item, selected, extra, onClick, onDoubleClick }) => {
    const { token } = theme.useToken()
    const { roomInfo, userInfo } = item
    const { t } = useTranslation()
    const noAvatar = 'https://i0.hdslb.com/bfs/face/member/noface.jpg@52w_52h_1c_1s.webp'
    const avatar = <Avatar className="avatar" src={roomInfo?.face || noAvatar} />
    const name = <h4
        className="name"
        style={{ lineHeight: token.lineHeight, color: token.colorText }}>
        {userInfo?.name}
    </h4>
    const description = <span
        className="description"
        style={{ lineHeight: token.lineHeight, color: token.colorTextTertiary }}>
        {`UID: ${userInfo?.uid}    ${t('roomID')}: ${roomInfo?.roomId}`}
    </span>
    const user = <div className="user">
        {avatar}
        <div className="info">
            {name}
            {description}
        </div>
    </div>
    return <div key={key}
        style={{ background: selected ? token.colorBgTextHover : undefined }}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className={`room-info`}>
        {user}
        {extra}
    </div>
}
export default StagedRoomInfo