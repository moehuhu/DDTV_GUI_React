
import RoomInfo from "./roomInfo"
import { List, Pagination, Spin, Button } from "antd"
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

    const [ctrlPressed, {
        setTrue: pressCtrl,
        setFalse: releaseCtrl,
        toggle: toggleCtrl }
    ] = useBoolean()
    const [shiftPressed, {
        setTrue: pressShift,
        setFalse: releaseShift,
        toggle: toggleShift }
    ] = useBoolean()
    useKeyPress('ctrl', pressCtrl)
    useKeyPress('ctrl', releaseCtrl, { events: ['keyup'] })
    useKeyPress('shift', e => { e.preventDefault(); pressShift(); })
    useKeyPress('shift', e => { e.preventDefault(); releaseShift(); }, { events: ['keyup'] })
    useEventListener('selectstart', e => { if (shiftPressed) { e.preventDefault() } })

    const [ctrlAllPressed, { setTrue: pressCtrlAll, setFalse: releaseCtrlAll }] = useBoolean()
    useKeyPress('ctrl.a', e => {
        e.preventDefault();
        pressCtrlAll();
        setSelectedItems(roomInfoList)
    })
    useKeyPress('ctrl.a', e => {
        e.preventDefault();
        releaseCtrlAll();
        setSelectedItems(roomInfoList)
    }, { events: ['keyup'] })
    const selected = item => selectedMap[item?.userInfo?.uid]
    const select = (item, index) => {
        if (ctrlPressed) {
            if (selected(item)) { setSelectedItems(removeItem(item)); return }
            setSelectedItems(items => [...items, item])
            setLastSelectedItem(item)
            return
        }
        if (shiftPressed) {
            const lastSelectedIndex = _(roomInfoList).findIndex(item => _.isEqual(item, lastSelectedItem))
            if (lastSelectedIndex < 0) {
                setSelectedItems([item]);
                setLastSelectedItem(item)
                return
            }
            const start = _.min([lastSelectedIndex, index, 0])
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
    const header = () => {
        if (isLoading) { return <Spin spinning={isLoading} /> }
        const totalItems = <span>{`${t('Total')}: ${total || 0}`}</span>
        const ctrlButton = <Button
            onClick={toggleCtrl}
            type={ctrlPressed ? 'primary' : 'default'}>
            Ctrl
        </Button>
        const shiftButton = <Button
            onClick={toggleShift}
            type={shiftPressed ? 'primary' : 'default'}>
            Shift
        </Button>
        const selectAllButton = <Button
            onClick={() => setSelectedItems(roomInfoList)}
            type={ctrlAllPressed ? 'primary' : 'default'}>
            Ctrl + A
        </Button>
        return <div className="header-bar">
            {totalItems}
            {ctrlButton}
            {shiftButton}
            {selectAllButton}
        </div>
    }
    const footer = <Pagination
        current={pageState.current}
        pageSize={pageState.pageSize}
        total={total}
        showSizeChanger={false}
        onChange={(current) => { setPageState({ current }) }}
    />
    const originList = <List bordered
        header={header()}
        className="origin-list"
        dataSource={roomInfoList}
        footer={footer}
        renderItem={renderOriginListItem} />
    return originList
}
export default OriginList