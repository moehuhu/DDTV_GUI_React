
import RoomInfo from "./roomInfo"
import { List, Pagination, Spin } from "antd"
import { useTranslation } from "react-i18next"
import { useKeyPress, useBoolean, useEventListener } from "ahooks"
import { useState, useMemo } from "react"
import _ from 'lodash'
const OriginList = (props) => {
    const { setPageState, pageState, isLoading, total, roomInfoList = [] } = props
    const { setStagedItems, stagedMap = {} } = props
    const [selectedItems, setSelectedItems] = useState([]);
    const [lastSelectedItem, setLastSelectedItem] = useState({})
    const removeItem = item => items => items?.filter(({ userInfo }) => userInfo?.uid != item?.userInfo?.uid)
    const uidMapper = item => item?.userInfo?.uid
    const { selectedMap } = useMemo(() => {
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
    useKeyPress('shift', e => { e.preventDefault(); pressShift(); })
    useKeyPress('shift', e => { e.preventDefault(); releaseShift(); }, { events: ['keyup'] })
    useKeyPress('ctrl.a', e => { e.preventDefault(); setSelectedItems(roomInfoList) })
    useEventListener('selectstart', e => {
        if (shiftPressed) { e.preventDefault() }
    })

    const selected = item => selectedMap[item?.userInfo?.uid]
    const select = (item, index) => {
        if (ctrlPressed) {
            if (selected(item)) { setSelectedItems(removeItem(item)); return }
            setSelectedItems(items => [...items, item])
            setLastSelectedItem(item)
            return
        }
        if (shiftPressed) {
            const lastSelectedIndex = _(roomInfoList).findIndex(item => _.isEqual(item, lastSelectedItem)) || 0
            const start = _.min([lastSelectedIndex, index])
            const end = _.max([lastSelectedIndex, index]) + 1
            const selectedSlice = _(roomInfoList).slice(start, end)
            setSelectedItems(selectedSlice)
            setLastSelectedItem(item)
            return
        }
        setLastSelectedItem(item)
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