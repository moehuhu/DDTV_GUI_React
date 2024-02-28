import { theme } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import StagedRoomInfo from "./stagedRoomInfo"
import _ from 'lodash'
const TargetList = (props) => {
    const { token } = theme.useToken()
    const { setStagedItems, stagedItems = [], stagedMap = {} } = props
    const staged = item => stagedMap[item?.userInfo?.uid]
    const removeItem = item => items => items?.filter(({ userInfo }) => userInfo?.uid != item?.userInfo?.uid)
    const removeStaged = (item) => {
        if (!staged(item)) { return }
        setStagedItems(removeItem(item))
    }
    const removeIcon = item => <CloseOutlined onClick={() => removeStaged(item)} />
    const renderItem = item => <StagedRoomInfo
        key={item?.userInfo?.uid}
        onDoubleClick={() => removeStaged(item)}
        item={item}
        extra={removeIcon(item)}
    />
    const { t } = useTranslation()
    const header = <div className="header" style={{ borderBlockEnd: `1px solid ${token.colorBorderSecondary}` }}>
        <span>{`${t('Selected')}: ${_.size(stagedItems) || 0}`}</span>
    </div>
    const list = <div
        className="target-list"
        style={{
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadiusLG
        }}>
        {header}
        <div className="list">{stagedItems.map(renderItem)}</div>
    </div>
    return list
}
export default TargetList