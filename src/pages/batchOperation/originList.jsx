
import RoomInfo from "./roomInfo"
import { List, Pagination, Spin } from "antd"
import { useTranslation } from "react-i18next"
import { useKeyPress } from "ahooks"
const OriginList = (props) => {
    const { pageState, isLoading, total, roomInfoList = [] } = props
    const { setPageState, setSelectedItems, setStagedItems } = props
    const { selectedUID = [], stagedUID = [], stagedMap = {} } = props

    useKeyPress('ctrl.a', e => {
        e.preventDefault()
        setSelectedItems(roomInfoList)
    })
    const select = (item, index) => {
        setSelectedItems([item])
    }
    const staged = item => stagedMap[item?.userInfo?.uid]
    const stage = (item) => {
        if (staged(item)) { return }
        setStagedItems(items => [...items, item])
    }
    const renderOriginListItem = (item, index) => <RoomInfo
        onClick={() => select(item, index)}
        onDoubleClick={() => stage(item)}
        item={item}
        selected={selectedUID.includes(item?.userInfo?.uid)}
        staged={staged(item)}
    />
    const { t } = useTranslation()
    const header = isLoading ? <Spin spinning={isLoading} /> : `${t('Total')}: ${total || 0}`
    const footer = <Pagination
        current={pageState.current}
        pageSize={pageState.pageSize}
        total={total}
        showSizeChanger={false}
        onChange={(current) => { setPageState({ current }) }}
    />
    const originList = <List bordered
        header={header}
        className="origin-list"
        dataSource={roomInfoList}
        footer={footer}
        renderItem={renderOriginListItem} />
    return originList
}
export default OriginList