import { List } from "antd"
import RoomInfo from "./roomInfo"
const TargetList = (props) => {
    const { setStagedItems, stagedItems = [], stagedUID = [] } = props
    const removeItem = item => items => items?.filter(({ userInfo }) => userInfo?.uid != item?.userInfo?.uid)
    const removeStaged = (item) => {
        if (!stagedUID.includes(item?.userInfo?.uid)) { return }
        setStagedItems(removeItem(item))
    }
    return <List bordered
        className="target-list"
        dataSource={stagedItems}
        renderItem={item => <RoomInfo onDoubleClick={() => removeStaged(item)} item={item} />} />
}
export default TargetList