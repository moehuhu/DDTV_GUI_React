import { useRef } from "react"
import { theme } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { useVirtualList } from "ahooks"
import { useTranslation } from "react-i18next"
import RoomInfo from "../RoomInfo"
import _ from 'lodash'
const TargetList = (props) => {
    const { token } = theme.useToken()
    const { setStagedItems, stagedItems = [], stagedMap = {} } = props
    const containerRef = useRef(null);
    const wrapperRef = useRef(null);
    const staged = item => stagedMap[item?.userInfo?.uid]
    const removeItem = item => items => items?.filter(({ userInfo }) => userInfo?.uid != item?.userInfo?.uid)
    const removeStaged = (item) => {
        if (!staged(item)) { return }
        setStagedItems(removeItem(item))
    }
    const removeIcon = item => <CloseOutlined onClick={() => removeStaged(item)} />
    const renderItem = item => <RoomInfo
        key={item?.userInfo?.uid}
        onDoubleClick={() => removeStaged(item)}
        item={item}
        extra={removeIcon(item)}
    />
    const { t } = useTranslation()
    const header = <div className="header" style={{ borderBlockEnd: `1px solid ${token.colorBorderSecondary}` }}>
        <span>{`${t('Selected')}: ${_.size(stagedItems) || 0}`}</span>
    </div>
    const [list] = useVirtualList(stagedItems, {
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