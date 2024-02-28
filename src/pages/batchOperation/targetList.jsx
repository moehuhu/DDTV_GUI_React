import { List } from "antd"
import RoomInfo from "./roomInfo"
const TargetList = (props) => {
    const { setStagedItems, stagedItems = [], stagedMap = {} } = props
    const staged = item => stagedMap[item?.userInfo?.uid]
    const removeItem = item => items => items?.filter(({ userInfo }) => userInfo?.uid != item?.userInfo?.uid)
    const removeStaged = (item) => {
        if (!staged(item)) { return }
        setStagedItems(removeItem(item))
    }
    return <List bordered
        className="target-list"
        dataSource={stagedItems}
        renderItem={item => <RoomInfo onDoubleClick={() => removeStaged(item)} item={item} />} />
}
export default TargetList