
import RoomInfo from "./roomInfo"
import { List, Pagination, Spin } from "antd"
import { useTranslation } from "react-i18next"
import { useKeyPress, useBoolean } from "ahooks"
import { useState, useMemo } from "react"
import _ from 'lodash'
const OriginList = (props) => {
    const { setPageState, pageState, isLoading, total, roomInfoList = [] } = props
    const { setStagedItems, stagedUID = [], stagedMap = {} } = props
    const [selectedItems, setSelectedItems] = useState([]);
    const uidMapper = item => item?.userInfo?.uid
    const { selectedUID, selectedMap } = useMemo(() => {
        const selectedUID = []
        const selectedMap = _(selectedItems)
            .map(item => {
                const uid = uidMapper(item)
                selectedUID.push(uid)
                return [uid, item]
            })
            .fromPairs()
            .value()
        return { selectedUID, selectedMap }
    }, [selectedItems])

    const [ctrlPressed, { setTrue: pressCtrl, setFalse: releaseCtrl }] = useBoolean()
    const [shiftPressed, { setTrue: pressShift, setFalse: releaseShift }] = useBoolean()
    useKeyPress('ctrl', pressCtrl)
    useKeyPress('ctrl', releaseCtrl, { events: ['keyup'] })
    useKeyPress('shift', pressShift)
    useKeyPress('shift', releaseShift, { events: ['keyup'] })
    useKeyPress('ctrl.a', e => {
        e.preventDefault()
        setSelectedItems(roomInfoList)
    })

    const selected = item => selectedMap[item?.userInfo?.uid]
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
        selected={selected(item)}
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