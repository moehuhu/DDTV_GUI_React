import { useRef } from "react"
import { theme } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { useVirtualList } from "ahooks"
import { useTranslation } from "react-i18next"
import RoomInfo from "../RoomInfo"
import _ from 'lodash'
const TargetList = (props) => {
    const { token } = theme.useToken()
    const { setStagedUIDs, stagedUIDs = [], stagedSet = {}, roomListMap = {} } = props
    const containerRef = useRef(null);
    const wrapperRef = useRef(null);
    const removeUID = uid => uids => uids?.filter(UID => uid != UID)
    const removeStaged = (uid) => {
        if (!stagedSet.has(uid)) { return }
        setStagedUIDs(removeUID(uid))
    }
    const removeIcon = uid => <CloseOutlined onClick={() => removeStaged(uid)} />
    const renderItem = uid => <RoomInfo
        key={uid}
        onDoubleClick={() => removeStaged(uid)}
        item={roomListMap[uid]}
        extra={removeIcon(uid)}
    />
    const { t } = useTranslation()
    const header = <div className="header" style={{ borderBlockEnd: `1px solid ${token.colorBorderSecondary}` }}>
        <span>{`${t('Selected')}: ${_.size(stagedUIDs) || 0}`}</span>
    </div>
    const [list] = useVirtualList(stagedUIDs, {
        containerTarget: containerRef,
        wrapperTarget: wrapperRef,
        itemHeight: 75,
        overscan: 20,
    })
    const targetList = <div
        className="target-list"
        style={{
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadiusLG
        }}>
        {header}
        <div ref={containerRef} className="list">
            <div ref={wrapperRef}>{list.map(ele => renderItem(ele.data))}</div>
        </div>
    </div>
    return targetList
}
export default TargetList