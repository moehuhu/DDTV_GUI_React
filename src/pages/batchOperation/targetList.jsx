import { List } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import RoomInfo from "./roomInfo"
import _ from 'lodash'
const TargetList = (props) => {
    const { setStagedItems, stagedItems = [], stagedMap = {} } = props
    const staged = item => stagedMap[item?.userInfo?.uid]
    const removeItem = item => items => items?.filter(({ userInfo }) => userInfo?.uid != item?.userInfo?.uid)
    const removeStaged = (item) => {
        if (!staged(item)) { return }
        setStagedItems(removeItem(item))
    }
    const removeIcon = item => <CloseOutlined onClick={() => removeStaged(item)} />
    const renderItem = item => <RoomInfo
        onDoubleClick={() => removeStaged(item)}
        item={item}
        extra={removeIcon(item)}
    />
    const { t } = useTranslation()
    const header = <span>{`${t('Selected')}: ${_.size(stagedItems) || 0}`}</span>
    return <List bordered
        header={header}
        className="target-list"
        dataSource={stagedItems}
        renderItem={renderItem} />
}
export default TargetList